import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import usersData from './data/users.json';
import scansData from './data/scans.json';
import rewardsData from './data/rewards.json';
import transactionsData from './data/transactions.json';
import auditData from './data/audit.json';
import mediaData from './data/media.json';
import notificationsData from './data/notifications.json';

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to simulate network errors occasionally
const shouldSimulateError = () => Math.random() < 0.05; // 5% chance of error

// In-memory user storage for demo
let demoUsers = [...usersData];
let nextUserId = Math.max(...usersData.map(u => u.id)) + 1;

// Token to user ID mapping for demo
const tokenToUserIdMap = new Map<string, number>();

// In-memory reward storage for demo
const userRewardsMap = new Map<number, any[]>();

// Helper function to clear rewards cache for a user
const clearUserRewards = (userId: number) => {
  userRewardsMap.delete(userId);
};

// Helper function to get current user by ID
const getCurrentUserById = (userId: number) => {
  let user = demoUsers.find(u => u.id === userId);
  
  // If user doesn't exist, create one (for demo mode persistence)
  if (!user) {
    // Use reliable avatar service (UI Avatars)
    const avatarUrl = `https://ui-avatars.com/api/?name=Demo+User+${userId}&background=random&color=fff&size=400&rounded=true`;
    
    user = {
      id: userId,
      name: `Demo User ${userId}`,
      email: `demo${userId}@example.com`,
      avatar: avatarUrl,
      totalPoints: 200,
      level: 1,
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      preferences: {
        notifications: true,
        emailUpdates: true,
        darkMode: false
      }
    };
    
    demoUsers.push(user);
    console.log('MSW: Created demo user:', user);
  }
  
  return user;
};

// Helper function to extract user ID from token
const getUserIdFromToken = (request: Request): number | null => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  let userId = tokenToUserIdMap.get(token);
  
  // If token exists but no user mapping, try to restore from localStorage simulation
  if (!userId && token.startsWith('demo-token-')) {
    // Try to get user data from localStorage simulation
    try {
      const storedUserData = localStorage.getItem('demo_user_data');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        // Check if this token matches the stored user's token
        if (userData.token === token) {
          // Restore the user
          userId = userData.id;
          tokenToUserIdMap.set(token, userId);
          
          // Check if user exists in demoUsers, if not, restore them
          let existingUser = demoUsers.find(u => u.id === userId);
          if (!existingUser) {
            demoUsers.push(userData);
            console.log('MSW: Restored user from localStorage:', userData);
          }
          
          return userId;
        }
      }
    } catch (error) {
      console.log('MSW: Error reading localStorage:', error);
    }
    
    // If no stored data found, create a new mapping (fallback)
    const hash = token.split('-')[2] || 'default';
    userId = Math.abs(hash.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0)) % 1000 + 1;
    
    tokenToUserIdMap.set(token, userId);
    console.log('MSW: Created new user mapping for token:', { token, userId });
  }
  
  return userId || null;
};

// Helper function to authenticate and get current user
const authenticateUser = (request: Request) => {
  const userId = getUserIdFromToken(request);
  if (!userId) {
    return { error: 'User not authenticated', status: 401 };
  }
  
  const currentUser = getCurrentUserById(userId);
  if (!currentUser) {
    return { error: 'User not found', status: 404 };
  }
  
  return { user: currentUser };
};

// Helper function to generate user-specific data
const generateUserSpecificData = (userId: number, dataType: string) => {
  // Use userId as seed for consistent data generation
  const seed = userId * 1000;
  return {
    userId,
    seed,
    dataType,
    timestamp: new Date().toISOString()
  };
};

// Predefined locations with coordinates for consistency
const predefinedLocations = [
  { name: 'Amsterdam Central', lat: 52.3791, lng: 4.9003 },
  { name: 'Rotterdam Centraal', lat: 51.9225, lng: 4.4792 },
  { name: 'Utrecht Centraal', lat: 52.0893, lng: 5.1100 },
  { name: 'The Hague Central', lat: 52.0802, lng: 4.3101 },
  { name: 'Eindhoven Central', lat: 51.4416, lng: 5.4697 },
  { name: 'Tilburg Central', lat: 51.5606, lng: 5.0919 },
  { name: 'Groningen Central', lat: 53.2194, lng: 6.5665 },
  { name: 'Almere Centrum', lat: 52.3508, lng: 5.2647 },
  { name: 'Breda Central', lat: 51.5719, lng: 4.7683 },
  { name: 'Nijmegen Central', lat: 51.8426, lng: 5.8528 },
  { name: 'Enschede Central', lat: 52.2206, lng: 6.8958 },
  { name: 'Haarlem Central', lat: 52.3792, lng: 4.6368 },
  { name: 'Arnhem Central', lat: 51.9851, lng: 5.8987 },
  { name: 'Zaanstad Central', lat: 52.4531, lng: 4.8136 },
  { name: 'Amersfoort Central', lat: 52.1552, lng: 5.3872 }
];

// Generate user-specific scans using only predefined locations
const generateUserScans = (userId: number, count: number = 10) => {
  const userData = generateUserSpecificData(userId, 'scans');
  
  // Ensure we don't generate more scans than we have locations
  const maxScans = Math.min(count, predefinedLocations.length);
  
  return Array.from({ length: maxScans }, (_, i) => {
    // Use modulo to cycle through predefined locations if we need more scans than locations
    const locationIndex = i % predefinedLocations.length;
    const location = predefinedLocations[locationIndex];
    
    return {
      id: `scan_${userId}_${i + 1}`,
      userId,
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      location: location.name,
      latitude: location.lat,
      longitude: location.lng,
      score: faker.number.int({ min: 60, max: 100 }),
      type: faker.helpers.arrayElement(['QR Scan', 'NFC Tap', 'Barcode Scan']),
      status: faker.helpers.arrayElement(['success', 'pending', 'failed']),
      points: faker.number.int({ min: 10, max: 50 }),
      details: {
        product: faker.commerce.productName(),
        category: faker.commerce.department(),
        brand: faker.company.name()
      }
    };
  });
};

// Generate user-specific rewards
const generateUserRewards = (userId: number, count: number = 5) => {
  const userData = generateUserSpecificData(userId, 'rewards');
  return Array.from({ length: count }, (_, i) => ({
    id: `reward_${userId}_${i + 1}`,
    userId,
    title: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    points: faker.number.int({ min: 25, max: 200 }), // More affordable range
    category: faker.helpers.arrayElement(['Gift Card', 'Discount', 'Free Item', 'Experience']),
    status: 'available', // Always generate available rewards
    expiryDate: faker.date.future().toISOString(),
    image: faker.image.url(),
    sponsor: faker.company.name()
  }));
};

// Generate user-specific transactions
const generateUserTransactions = (userId: number, count: number = 8) => {
  const userData = generateUserSpecificData(userId, 'transactions');
  return Array.from({ length: count }, (_, i) => ({
    id: `txn_${userId}_${i + 1}`,
    userId,
    amount: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
    type: faker.helpers.arrayElement(['earnings', 'payout', 'bonus', 'penalty']),
    status: faker.helpers.arrayElement(['completed', 'pending', 'failed']),
    timestamp: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: faker.lorem.sentence(),
    reference: faker.string.alphanumeric(10).toUpperCase()
  }));
};

export const handlers = [
  // Authentication endpoints
  http.post('/api/auth/login', async ({ request }) => {
    await delay(faker.number.int({ min: 300, max: 800 }));
    
    if (shouldSimulateError()) {
      return HttpResponse.json(
        { success: false, error: 'Network error' },
        { status: 500 }
      );
    }

    try {
      const body = await request.json() as { email: string; password: string };
      
      // In demo mode, accept any email/password combination
      // Find existing user or create a new one
      let user = demoUsers.find(u => u.email === body.email);
      
      if (!user) {
        // Create a new user for demo
        user = {
          id: nextUserId++,
          name: body.email.split('@')[0],
          email: body.email,
          uid: 'USR-' + faker.string.alphanumeric(8).toUpperCase(),
          avatar: faker.image.avatar(),
          status: 'active',
          activationLevel: 1,
          totalPoints: 200, // Give new users starting points
          createdAt: new Date().toISOString()
        };
        demoUsers.push(user);
      }

      const token = 'demo-token-' + faker.string.alphanumeric(32);
      
      // Store token to user ID mapping
      tokenToUserIdMap.set(token, user.id);
      
      // Store user data in localStorage for persistence across reloads
      try {
        const userDataToStore = {
          ...user,
          token: token,
          lastLogin: new Date().toISOString()
        };
        localStorage.setItem('demo_user_data', JSON.stringify(userDataToStore));
        console.log('MSW: Stored user data in localStorage:', userDataToStore);
      } catch (error) {
        console.log('MSW: Error storing user data:', error);
      }

      return HttpResponse.json({
        success: true,
        data: {
          user,
          token
        }
      });
    } catch (error) {
      return HttpResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      );
    }
  }),

  http.post('/api/auth/register', async ({ request }) => {
    await delay(faker.number.int({ min: 400, max: 800 }));
    
    if (shouldSimulateError()) {
      return HttpResponse.json(
        { success: false, error: 'Network error' },
        { status: 500 }
      );
    }

    try {
      const body = await request.json() as { name: string; email: string; password: string };
      
      // Check if user already exists
      const existingUser = demoUsers.find(u => u.email === body.email);
      if (existingUser) {
        return HttpResponse.json(
          { success: false, error: 'User with this email already exists' },
          { status: 400 }
        );
      }

      // Create new user
      const newUser = {
        id: nextUserId++,
        name: body.name,
        email: body.email,
        uid: 'USR-' + faker.string.alphanumeric(8).toUpperCase(),
        avatar: faker.image.avatar(),
        status: 'active',
        activationLevel: 1,
        totalPoints: 200, // Give new users starting points
        createdAt: new Date().toISOString()
      };
      
      demoUsers.push(newUser);
      
      const token = 'demo-token-' + faker.string.alphanumeric(32);
      
      // Store token to user ID mapping
      tokenToUserIdMap.set(token, newUser.id);
      
      return HttpResponse.json({
        success: true,
        data: {
          user: newUser,
          token
        }
      });
    } catch (error) {
      return HttpResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      );
    }
  }),

  http.get('/api/auth/me', async ({ request }) => {
    await delay(faker.number.int({ min: 200, max: 500 }));
    
    const authResult = authenticateUser(request);
    if (authResult.error) {
      return HttpResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }
    
    return HttpResponse.json({
      success: true,
      data: authResult.user
    });
  }),

  http.put('/api/auth/profile', async ({ request }) => {
    await delay(faker.number.int({ min: 400, max: 700 }));
    
    try {
      const body = await request.json() as Partial<typeof demoUsers[0]>;
      const currentUser = { ...demoUsers[0], ...body };
      demoUsers[0] = currentUser;
      
      return HttpResponse.json({
        success: true,
        data: currentUser
      });
    } catch (error) {
      return HttpResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      );
    }
  }),

  http.post('/api/auth/logout', async () => {
    await delay(faker.number.int({ min: 200, max: 400 }));
    return HttpResponse.json({
      success: true,
      data: { message: 'Logged out successfully' }
    });
  }),

  // Scans endpoints
  http.get('/api/scans/chart', async ({ request }) => {
    await delay(faker.number.int({ min: 200, max: 400 }));
    
    const authResult = authenticateUser(request);
    if (authResult.error) {
      return HttpResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }
    
    const currentUser = authResult.user!;
    
    // Generate user-specific chart data (limit to predefined locations)
    const userScans = generateUserScans(currentUser.id, Math.min(7, predefinedLocations.length));
    const chartData = userScans.map((scan, index) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
      scans: scan.score
    }));
    
    return HttpResponse.json({
      success: true,
      data: chartData
    });
  }),

  http.get('/api/scans/recent', async ({ request }) => {
    await delay(faker.number.int({ min: 300, max: 600 }));
    
    const authResult = authenticateUser(request);
    if (authResult.error) {
      return HttpResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }
    
    const currentUser = authResult.user!;
    
    // Generate user-specific recent scans (limit to predefined locations)
    const userScans = generateUserScans(currentUser.id, Math.min(5, predefinedLocations.length));
    
    return HttpResponse.json({
      success: true,
      data: userScans
    });
  }),

  http.get('/api/scans/history', async ({ request }) => {
    await delay(faker.number.int({ min: 400, max: 800 }));
    
    const authResult = authenticateUser(request);
    if (authResult.error) {
      return HttpResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }
    
    const currentUser = authResult.user!;
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // Generate user-specific scan history (limit to predefined locations)
    const userScans = generateUserScans(currentUser.id, Math.min(20, predefinedLocations.length));
    
    return HttpResponse.json({
      success: true,
      data: {
        data: userScans.slice((page - 1) * limit, page * limit),
        total: userScans.length,
        page,
        limit,
        hasMore: page * limit < userScans.length
      }
    });
  }),

  http.get('/api/scans/stats', async ({ request }) => {
    await delay(faker.number.int({ min: 200, max: 400 }));
    
    const authResult = authenticateUser(request);
    if (authResult.error) {
      return HttpResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }
    
    const currentUser = authResult.user!;
    
    // Generate user-specific stats
    const userScans = generateUserScans(currentUser.id, 20);
    const totalScans = userScans.length;
    const thisWeek = userScans.filter(scan => 
      new Date(scan.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    const uniqueLocations = new Set(userScans.map(scan => scan.location)).size;
    
    return HttpResponse.json({
      success: true,
      data: {
        totalScans,
        thisWeek,
        uniqueLocations,
        sponsors: Math.floor(uniqueLocations / 2)
      }
    });
  }),

  http.get('/api/scans/map-markers', async ({ request }) => {
    await delay(faker.number.int({ min: 300, max: 500 }));
    
    const authResult = authenticateUser(request);
    if (authResult.error) {
      return HttpResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }
    
    const currentUser = authResult.user!;
    
    // Generate user-specific map markers (limit to predefined locations)
    const userScans = generateUserScans(currentUser.id, Math.min(15, predefinedLocations.length));
    
    // Create map markers with enhanced data using actual scan coordinates
    const mapMarkers = userScans.map(scan => ({
      id: scan.id,
      lat: scan.latitude,
      lng: scan.longitude,
      title: scan.location,
      description: `${scan.details.brand} - ${scan.type}`,
      type: 'scan' as const,
      timestamp: scan.timestamp,
      points: scan.points,
      status: scan.status,
      scanType: scan.type,
      brand: scan.details.brand
    }));
    
    // Add some sponsor locations using predefined coordinates
    const sponsorLocations = [
      {
        id: 'sponsor-1',
        lat: 52.3676,
        lng: 4.9041,
        title: 'TechStore Downtown',
        description: 'Electronics & Gadgets',
        type: 'sponsor' as const,
        scanCount: faker.number.int({ min: 5, max: 25 }),
        brand: 'TechStore'
      },
      {
        id: 'sponsor-2',
        lat: 51.9225,
        lng: 4.4792,
        title: 'Digicomp Plaza',
        description: 'Computer Services',
        type: 'sponsor' as const,
        scanCount: faker.number.int({ min: 3, max: 18 }),
        brand: 'Digicomp'
      },
      {
        id: 'sponsor-3',
        lat: 52.0893,
        lng: 5.1100,
        title: 'NeoCard Center',
        description: 'Official NeoCard Hub',
        type: 'sponsor' as const,
        scanCount: faker.number.int({ min: 10, max: 35 }),
        brand: 'NeoCard'
      }
    ];
    
    // Get the most recent scan for initial map center
    const mostRecentScan = userScans.reduce((latest, current) => {
      const latestTime = new Date(latest.timestamp).getTime();
      const currentTime = new Date(current.timestamp).getTime();
      return currentTime > latestTime ? current : latest;
    });

    return HttpResponse.json({
      success: true,
      data: [...mapMarkers, ...sponsorLocations],
      metadata: {
        mostRecentScan: {
          id: mostRecentScan.id,
          location: mostRecentScan.location,
          lat: mostRecentScan.latitude,
          lng: mostRecentScan.longitude,
          timestamp: mostRecentScan.timestamp
        }
      }
    });
  }),

  http.post('/api/scans/record', async () => {
    await delay(faker.number.int({ min: 500, max: 1000 }));
    return HttpResponse.json({
      success: true,
      data: {
        id: faker.number.int({ min: 1000, max: 9999 }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: 'Today',
        location: faker.location.city(),
        sponsor: faker.company.name(),
        type: faker.helpers.arrayElement(['QR Scan', 'NFC Tap']),
        verified: true,
        latitude: parseFloat(faker.location.latitude()),
        longitude: parseFloat(faker.location.longitude())
      }
    });
  }),

  // Rewards endpoints
  http.get('/api/rewards/levels', async () => {
    await delay(faker.number.int({ min: 200, max: 400 }));
    return HttpResponse.json({
      success: true,
      data: [
        { name: "Bronze", min: 0, max: 100, color: "from-orange-900 to-orange-700" },
        { name: "Silver", min: 100, max: 250, color: "from-gray-400 to-gray-300" },
        { name: "Gold", min: 250, max: 500, color: "from-yellow-600 to-yellow-400" },
        { name: "Platinum", min: 500, max: 1000, color: "from-cyan-600 to-cyan-400" },
        { name: "Diamond", min: 1000, max: 9999, color: "from-purple-600 to-purple-400" },
      ]
    });
  }),

  http.get('/api/rewards/current-level', async () => {
    await delay(faker.number.int({ min: 200, max: 400 }));
    return HttpResponse.json({
      success: true,
      data: {
        level: { name: "Silver", min: 100, max: 250, color: "from-gray-400 to-gray-300" },
        progress: 65,
        points: 165
      }
    });
  }),

  http.get('/api/rewards/available', async ({ request }) => {
    await delay(faker.number.int({ min: 300, max: 600 }));
    
    const authResult = authenticateUser(request);
    if (authResult.error) {
      return HttpResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }
    
    const currentUser = authResult.user!;
    
    // Get or generate user-specific rewards
    if (!userRewardsMap.has(currentUser.id)) {
      userRewardsMap.set(currentUser.id, generateUserRewards(currentUser.id, 8));
    }
    
    const userRewards = userRewardsMap.get(currentUser.id)!;
    
    return HttpResponse.json({
      success: true,
      data: userRewards
    });
  }),

  http.get('/api/rewards/history', async ({ request }) => {
    await delay(faker.number.int({ min: 300, max: 600 }));
    
    const authResult = authenticateUser(request);
    if (authResult.error) {
      return HttpResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }
    
    const currentUser = authResult.user!;
    
    // Get user's rewards and filter for redeemed ones
    if (!userRewardsMap.has(currentUser.id)) {
      userRewardsMap.set(currentUser.id, generateUserRewards(currentUser.id, 8));
    }
    
    const userRewards = userRewardsMap.get(currentUser.id)!;
    const redeemedRewards = userRewards.filter(reward => reward.status === 'redeemed');
    
    return HttpResponse.json({
      success: true,
      data: redeemedRewards
    });
  }),

  http.post('/api/rewards/redeem', async ({ request }) => {
    console.log('MSW redeem handler called');
    await delay(faker.number.int({ min: 500, max: 1000 }));
    
    try {
      console.log('Authenticating user...');
      const authResult = authenticateUser(request);
      if (authResult.error) {
        console.log('Authentication failed:', authResult.error);
        return HttpResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
      }
      
      const currentUser = authResult.user!;
      console.log('Current user:', currentUser.id, currentUser.name);
      
      // Fix: Give users with 0 points some starting points
      if (currentUser.totalPoints === 0) {
        currentUser.totalPoints = 200;
        // Update the user in demoUsers array
        demoUsers = demoUsers.map(u => (u.id === currentUser.id ? currentUser : u));
        console.log('Updated user points to:', currentUser.totalPoints);
      }
      
      const body = await request.json();
      console.log('Request body:', body);
      const { rewardId } = body;
      
      // Get user's rewards from persistent storage
      if (!userRewardsMap.has(currentUser.id)) {
        console.log('No rewards found for user:', currentUser.id);
        return HttpResponse.json({ 
          success: false, 
          error: 'No rewards found for user' 
        }, { status: 404 });
      }
      
      const userRewards = userRewardsMap.get(currentUser.id)!;
      console.log('User rewards:', userRewards.map(r => ({ id: r.id, title: r.title, status: r.status })));
      const reward = userRewards.find(r => r.id === rewardId);
      
      if (!reward) {
        console.log('Reward not found:', rewardId);
        return HttpResponse.json({ 
          success: false, 
          error: 'Reward not found' 
        }, { status: 404 });
      }
      
      console.log('Found reward:', reward.title, 'Status:', reward.status, 'Points:', reward.points);
      
      if (reward.status !== 'available') {
        console.log('Reward not available:', reward.status);
        return HttpResponse.json({ 
          success: false, 
          error: 'Reward is not available for redemption' 
        }, { status: 400 });
      }
      
      if (currentUser.totalPoints < reward.points) {
        console.log('Insufficient points:', currentUser.totalPoints, '<', reward.points);
        return HttpResponse.json({ 
          success: false, 
          error: 'Insufficient points' 
        }, { status: 400 });
      }
      
      console.log('Processing redemption...');
      
      // Update user points (deduct reward cost)
      const updatedUser = {
        ...currentUser,
        totalPoints: currentUser.totalPoints - reward.points
      };
      
      // Update the user in demoUsers array
      demoUsers = demoUsers.map(u => (u.id === currentUser.id ? updatedUser : u));
      
      // Update the reward status in persistent storage
      const updatedRewards = userRewards.map(r => 
        r.id === rewardId ? { ...r, status: 'redeemed' } : r
      );
      userRewardsMap.set(currentUser.id, updatedRewards);
      
      console.log('Redemption successful! New points:', updatedUser.totalPoints);
      
      return HttpResponse.json({
        success: true,
        data: {
          success: true,
          message: `Reward "${reward.title}" redeemed successfully!`,
          remainingPoints: updatedUser.totalPoints,
          reward: {
            ...reward,
            status: 'redeemed'
          }
        }
      });
    } catch (error) {
      console.error('Error redeeming reward:', error);
      return HttpResponse.json(
        { success: false, error: 'Failed to redeem reward' },
        { status: 500 }
      );
    }
  }),

  http.get('/api/rewards/achievements', async () => {
    await delay(faker.number.int({ min: 200, max: 400 }));
    return HttpResponse.json({
      success: true,
      data: [
        { id: 1, title: "First Scan", icon: "Zap", unlocked: true },
        { id: 2, title: "Week Warrior", icon: "Star", unlocked: true },
        { id: 3, title: "Multi-Location", icon: "Trophy", unlocked: true },
        { id: 4, title: "100 Scans", icon: "Gift", unlocked: false },
      ]
    });
  }),

  // Payments endpoints
  http.get('/api/payments/stats', async () => {
    await delay(faker.number.int({ min: 200, max: 400 }));
    return HttpResponse.json({
      success: true,
      data: {
        totalBalance: 60,
        thisWeek: 68,
        pendingPayouts: 1
      }
    });
  }),

  http.get('/api/payments/history', async ({ request }) => {
    await delay(faker.number.int({ min: 300, max: 600 }));
    
    const authResult = authenticateUser(request);
    if (authResult.error) {
      return HttpResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }
    
    const currentUser = authResult.user!;
    
    // Generate user-specific transactions
    const userTransactions = generateUserTransactions(currentUser.id, 10);
    
    return HttpResponse.json({
      success: true,
      data: userTransactions
    });
  }),

  http.get('/api/payments/earnings-chart', async ({ request }) => {
    await delay(faker.number.int({ min: 200, max: 400 }));
    
    const authResult = authenticateUser(request);
    if (authResult.error) {
      return HttpResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }
    
    const currentUser = authResult.user!;
    
    // Generate user-specific earnings chart
    const userTransactions = generateUserTransactions(currentUser.id, 6);
    const chartData = userTransactions.map((txn, index) => ({
      week: `W${index + 1}`,
      amount: txn.amount
    }));
    
    return HttpResponse.json({
      success: true,
      data: chartData
    });
  }),

  http.post('/api/payments/mpesa/initiate', async () => {
    await delay(faker.number.int({ min: 1000, max: 2000 }));
    return HttpResponse.json({
      success: true,
      data: {
        success: true,
        checkoutRequestId: 'ws_CO_' + faker.string.alphanumeric(20),
        merchantRequestId: 'ws_MR_' + faker.string.alphanumeric(20),
        responseCode: '0',
        responseDescription: 'Success. Request accepted for processing',
        customerMessage: 'Success. Request accepted for processing'
      }
    });
  }),

  // Audit endpoints
  http.get('/api/audit/stats', async () => {
    await delay(faker.number.int({ min: 200, max: 400 }));
    return HttpResponse.json({
      success: true,
      data: {
        currentBlock: 744642,
        verifiedRecords: 127,
        pending: 1,
        latency: 122
      }
    });
  }),

  http.get('/api/audit/logs', async () => {
    await delay(faker.number.int({ min: 300, max: 600 }));
    return HttpResponse.json({
      success: true,
      data: auditData
    });
  }),

  http.get('/api/audit/current-hash', async () => {
    await delay(faker.number.int({ min: 200, max: 400 }));
    return HttpResponse.json({
      success: true,
      data: {
        hash: "0xa7f92e9F5b332aaA12d",
        blockNumber: 744642,
        timestamp: "2025-10-20 10:49 UTC",
        verified: true
      }
    });
  }),

  http.post('/api/audit/verify-hash', async ({ request }) => {
    await delay(faker.number.int({ min: 500, max: 1000 }));
    const body = await request.json() as { hash: string };
    
    // Simulate verification logic
    const isVerified = body.hash.startsWith('0x') && body.hash.length > 10;
    
    return HttpResponse.json({
      success: true,
      data: {
        verified: isVerified,
        blockNumber: isVerified ? faker.number.int({ min: 700000, max: 800000 }) : undefined,
        timestamp: isVerified ? new Date().toISOString() : undefined,
        transactionHash: isVerified ? '0x' + faker.string.alphanumeric(64) : undefined
      }
    });
  }),

  // Media endpoints
  http.get('/api/media/gallery', async () => {
    await delay(faker.number.int({ min: 300, max: 600 }));
    return HttpResponse.json({
      success: true,
      data: mediaData
    });
  }),

  http.post('/api/media/upload', async () => {
    await delay(faker.number.int({ min: 1000, max: 3000 }));
    return HttpResponse.json({
      success: true,
      data: {
        id: faker.string.uuid(),
        name: faker.system.fileName(),
        size: faker.number.int({ min: 1000, max: 10000000 }),
        type: faker.system.mimeType(),
        url: faker.image.url(),
        status: 'completed',
        progress: 100
      }
    });
  }),

  http.post('/api/media/:id/verify', async () => {
    await delay(faker.number.int({ min: 500, max: 1000 }));
    return HttpResponse.json({
      success: true,
      data: { verified: true }
    });
  }),

  http.get('/api/media/drone-show', async () => {
    await delay(faker.number.int({ min: 300, max: 600 }));
    return HttpResponse.json({
      success: true,
      data: mediaData.filter(item => item.type === 'video')
    });
  }),

  http.get('/api/media/stats', async () => {
    await delay(faker.number.int({ min: 300, max: 600 }));
    return HttpResponse.json({
      success: true,
      data: {
        totalProofs: mediaData.length,
        verified: mediaData.filter(item => item.status === 'verified').length,
        pending: mediaData.filter(item => item.status === 'pending').length,
        fraudAlerts: faker.number.int({ min: 0, max: 3 }), // Random fraud alerts for demo
        totalSize: "18.2 MB",
        imageCount: mediaData.filter(item => item.type === 'image').length,
        videoCount: mediaData.filter(item => item.type === 'video').length,
        documentCount: mediaData.filter(item => item.type === 'document').length
      }
    });
  }),

  // Notifications endpoints
  http.get('/api/notifications', async () => {
    await delay(faker.number.int({ min: 300, max: 600 }));
    return HttpResponse.json({
      success: true,
      data: notificationsData
    });
  }),

  http.post('/api/notifications/:id/read', async () => {
    await delay(faker.number.int({ min: 200, max: 400 }));
    return HttpResponse.json({
      success: true,
      data: { success: true }
    });
  }),

  http.post('/api/notifications/mark-all-read', async () => {
    await delay(faker.number.int({ min: 300, max: 500 }));
    return HttpResponse.json({
      success: true,
      data: { success: true }
    });
  }),

  http.get('/api/notifications/stats', async () => {
    await delay(faker.number.int({ min: 200, max: 400 }));
    return HttpResponse.json({
      success: true,
      data: {
        unread: 2,
        today: 4,
        rewards: 1,
        security: 1
      }
    });
  }),

  // AI Chat endpoints
  http.post('/api/ai/chat', async ({ request }) => {
    await delay(faker.number.int({ min: 1000, max: 3000 }));
    const body = await request.json() as { message: string };
    
    // Simple AI responses based on keywords
    let response = "I'm here to help you with your NeoCard dashboard. How can I assist you today?";
    
    if (body.message.toLowerCase().includes('reward')) {
      response = "You currently have 165 points and are at Silver level. You can redeem rewards from the Rewards section. Would you like me to show you available rewards?";
    } else if (body.message.toLowerCase().includes('scan')) {
      response = "You've made 247 total scans this month. Your most active day is Friday. Keep scanning to earn more rewards!";
    } else if (body.message.toLowerCase().includes('payment') || body.message.toLowerCase().includes('mpesa')) {
      response = "Your current balance is KES 60. You have 1 pending payout. M-Pesa payments are processed within 24 hours.";
    } else if (body.message.toLowerCase().includes('blockchain') || body.message.toLowerCase().includes('hash')) {
      response = "Your blockchain hash is verified and recorded on block 744642. All your transactions are securely stored on-chain.";
    } else if (body.message.toLowerCase().includes('help')) {
      response = "I can help you with rewards, scans, payments, blockchain verification, and general questions about your NeoCard dashboard. What would you like to know?";
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        message: response,
        suggestions: [
          "Show me my rewards",
          "Check my scan history",
          "View my balance",
          "Verify blockchain hash"
        ]
      }
    });
  }),

  http.get('/api/ai/status', async () => {
    await delay(faker.number.int({ min: 200, max: 400 }));
    return HttpResponse.json({
      success: true,
      data: {
        available: true,
        model: "NeoCard AI v2.1",
        responseTime: faker.number.int({ min: 500, max: 2000 })
      }
    });
  }),

  // Debug endpoint to clear rewards cache
  http.post('/api/debug/clear-rewards', async ({ request }) => {
    const authResult = authenticateUser(request);
    if (authResult.error) {
      return HttpResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }
    
    const currentUser = authResult.user!;
    clearUserRewards(currentUser.id);
    
    return HttpResponse.json({
      success: true,
      data: { message: `Rewards cache cleared for user ${currentUser.id}` }
    });
  }),

  // Settings endpoints
  http.get('/api/settings', async () => {
    await delay(faker.number.int({ min: 300, max: 600 }));
    return HttpResponse.json({
      success: true,
      data: {
        profile: usersData[0],
        preferences: {
          notifications: {
            rewards: true,
            security: true,
            sponsors: true,
            system: true
          },
          privacy: {
            profileVisible: true,
            locationSharing: true
          }
        },
        security: {
          twoFactor: false,
          biometric: false
        },
        privacy: {
          profileVisible: true,
          locationSharing: true
        }
      }
    });
  }),

  http.put('/api/settings/profile', async () => {
    await delay(faker.number.int({ min: 500, max: 1000 }));
    return HttpResponse.json({
      success: true,
      data: { success: true }
    });
  }),

  http.put('/api/settings/preferences', async () => {
    await delay(faker.number.int({ min: 400, max: 800 }));
    return HttpResponse.json({
      success: true,
      data: { success: true }
    });
  }),
];
