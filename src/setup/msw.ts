import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';
import { handlers } from '../mocks/handlers';

export async function initMsw() {
  if (typeof window === 'undefined') {
    return;
  }

  console.log('Initializing MSW...');
  console.log('Environment VITE_DEMO:', import.meta.env.VITE_DEMO);
  console.log('Handlers count:', handlers.length);

  // Add a simple test handler
  const testHandlers = [
    ...handlers,
    http.get('/api/test', () => {
      console.log('MSW test handler called');
      return HttpResponse.json({ success: true, message: 'MSW is working!' });
    })
  ];

  try {
    const worker = setupWorker(...testHandlers);
    
    await worker.start({
      onUnhandledRequest: 'warn'
    });

    console.log('MSW started in demo mode');
    console.log('Worker:', worker);
    
    // Test if MSW is working
    console.log('Testing MSW with fetch...');
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      console.log('MSW test response:', data);
    } catch (err) {
      console.error('MSW test failed:', err);
    }
    
    // Test rewards endpoint specifically
    console.log('Testing rewards endpoint...');
    try {
      const response = await fetch('/api/rewards/available');
      const data = await response.json();
      console.log('Rewards test response:', data);
    } catch (err) {
      console.error('Rewards test failed:', err);
    }
    
    // Test media endpoints specifically
    console.log('Testing media endpoints...');
    try {
      const response = await fetch('/api/media/gallery');
      const data = await response.json();
      console.log('Media gallery test response:', data);
    } catch (err) {
      console.error('Media gallery test failed:', err);
    }
    
    try {
      const response = await fetch('/api/media/stats');
      const data = await response.json();
      console.log('Media stats test response:', data);
    } catch (err) {
      console.error('Media stats test failed:', err);
    }
    
  } catch (error) {
    console.error('MSW initialization failed:', error);
  }
}
