import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, User, Lock, Mail } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await login(formData.email, formData.password);
        if (!response.success) {
          setError(response.error || 'Login failed');
        }
      } else {
        // Validation for registration
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setIsLoading(false);
          return;
        }

        const response = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        if (!response.success) {
          setError(response.error || 'Registration failed');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setError('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setError('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-background p-4">
      <div className={`auth-container relative w-full max-w-[750px] h-[450px] sm:h-[500px] md:h-[450px] border-2 border-primary shadow-[0_0_25px_hsl(var(--primary))] overflow-hidden transition-all duration-700 ease-out ${isLogin ? '' : 'active'}`}>
        {/* Curved Shapes - Desktop only */}
        <div className="curved-shape absolute right-0 -top-1 h-[600px] w-[850px] bg-gradient-to-br from-background to-primary transform rotate-[10deg] skew-y-[40deg] origin-bottom-right transition-all duration-[1.5s] delay-[1.6s] hidden lg:block"></div>
        <div className="curved-shape2 absolute left-[250px] top-full h-[700px] w-[850px] bg-background border-t-[3px] border-primary transform rotate-0 skew-y-0 origin-bottom-left transition-all duration-[1.5s] delay-[0.5s] hidden lg:block"></div>
        
        {/* Mobile Background Elements */}
        <div className="mobile-bg-shape absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-xl transition-all duration-700 lg:hidden"></div>
        <div className="mobile-bg-shape2 absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-full blur-xl transition-all duration-700 lg:hidden"></div>

        {/* Login Form */}
        <div className={`form-box Login absolute top-0 left-0 w-full lg:w-1/2 h-full flex justify-center flex-col px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 ${isLogin ? '' : 'opacity-0 pointer-events-none'}`}>
          <h2 className="animation text-2xl sm:text-3xl md:text-[28px] lg:text-[32px] text-center text-foreground mb-3 sm:mb-4 md:mb-6 lg:mb-8" style={{ '--D': 0, '--S': 21 } as React.CSSProperties}>
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
            <div className="input-box animation relative w-full h-[45px] sm:h-[50px] mt-2 sm:mt-3 md:mt-4 lg:mt-6" style={{ '--D': 1, '--S': 22 } as React.CSSProperties}>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full h-full bg-transparent border-none outline-none text-sm sm:text-base text-foreground font-semibold border-b-2 border-foreground pr-6 transition-all duration-500 focus:border-primary valid:border-primary"
              />
              <label className="absolute top-1/2 left-0 transform -translate-y-1/2 text-sm sm:text-base text-foreground transition-all duration-500 pointer-events-none">
                Email
              </label>
              <Mail className="absolute top-1/2 right-0 transform -translate-y-1/2 w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-foreground transition-colors duration-500" />
            </div>

            <div className="input-box animation relative w-full h-[45px] sm:h-[50px] mt-2 sm:mt-3 md:mt-4 lg:mt-6" style={{ '--D': 2, '--S': 23 } as React.CSSProperties}>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full h-full bg-transparent border-none outline-none text-sm sm:text-base text-foreground font-semibold border-b-2 border-foreground pr-6 transition-all duration-500 focus:border-primary valid:border-primary"
              />
              <label className="absolute top-1/2 left-0 transform -translate-y-1/2 text-sm sm:text-base text-foreground transition-all duration-500 pointer-events-none">
                Password
              </label>
              <Lock className="absolute top-1/2 right-0 transform -translate-y-1/2 w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-foreground transition-colors duration-500" />
            </div>

            {error && (
              <div className="animation text-red-400 text-xs sm:text-sm text-center" style={{ '--D': 2.5, '--S': 23.5 } as React.CSSProperties}>
                {error}
              </div>
            )}

            <div className="input-box animation mt-3 sm:mt-4 md:mt-5 lg:mt-6" style={{ '--D': 3, '--S': 24 } as React.CSSProperties}>
              <button
                type="submit"
                disabled={isLoading}
                className="btn relative w-full h-[40px] sm:h-[45px] bg-transparent rounded-[40px] cursor-pointer text-sm sm:text-base font-semibold border-2 border-primary overflow-hidden z-10 hover:before:top-0 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </div>

            <div className="regi-link animation text-xs sm:text-sm text-center mt-3 sm:mt-4 md:mt-5 lg:mt-6" style={{ '--D': 4, '--S': 25 } as React.CSSProperties}>
              <p className="text-foreground">
                Don't have an account? <br />
                <button
                  type="button"
                  onClick={switchToRegister}
                  className="text-primary font-semibold hover:underline transition-all duration-300"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Register Form */}
        <div className={`form-box Register absolute top-0 right-0 w-full lg:w-1/2 h-full flex justify-center flex-col px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 ${isLogin ? 'opacity-0 pointer-events-none' : ''}`}>
          <h2 className="animation text-2xl sm:text-3xl md:text-[28px] lg:text-[32px] text-center text-foreground mb-3 sm:mb-4 md:mb-6 lg:mb-8" style={{ '--li': 17, '--S': 0 } as React.CSSProperties}>
            Register
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
            <div className="input-box animation relative w-full h-[45px] sm:h-[50px] mt-2 sm:mt-3 md:mt-4 lg:mt-6" style={{ '--li': 18, '--S': 1 } as React.CSSProperties}>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full h-full bg-transparent border-none outline-none text-sm sm:text-base text-foreground font-semibold border-b-2 border-foreground pr-6 transition-all duration-500 focus:border-primary valid:border-primary"
              />
              <label className="absolute top-1/2 left-0 transform -translate-y-1/2 text-sm sm:text-base text-foreground transition-all duration-500 pointer-events-none">
                Full Name
              </label>
              <User className="absolute top-1/2 right-0 transform -translate-y-1/2 w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-foreground transition-colors duration-500" />
            </div>

            <div className="input-box animation relative w-full h-[45px] sm:h-[50px] mt-2 sm:mt-3 md:mt-4 lg:mt-6" style={{ '--li': 19, '--S': 2 } as React.CSSProperties}>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full h-full bg-transparent border-none outline-none text-sm sm:text-base text-foreground font-semibold border-b-2 border-foreground pr-6 transition-all duration-500 focus:border-primary valid:border-primary"
              />
              <label className="absolute top-1/2 left-0 transform -translate-y-1/2 text-sm sm:text-base text-foreground transition-all duration-500 pointer-events-none">
                Email
              </label>
              <Mail className="absolute top-1/2 right-0 transform -translate-y-1/2 w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-foreground transition-colors duration-500" />
            </div>

            <div className="input-box animation relative w-full h-[45px] sm:h-[50px] mt-2 sm:mt-3 md:mt-4 lg:mt-6" style={{ '--li': 19, '--S': 3 } as React.CSSProperties}>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full h-full bg-transparent border-none outline-none text-sm sm:text-base text-foreground font-semibold border-b-2 border-foreground pr-6 transition-all duration-500 focus:border-primary valid:border-primary"
              />
              <label className="absolute top-1/2 left-0 transform -translate-y-1/2 text-sm sm:text-base text-foreground transition-all duration-500 pointer-events-none">
                Password
              </label>
              <Lock className="absolute top-1/2 right-0 transform -translate-y-1/2 w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-foreground transition-colors duration-500" />
            </div>

            <div className="input-box animation relative w-full h-[45px] sm:h-[50px] mt-2 sm:mt-3 md:mt-4 lg:mt-6" style={{ '--li': 20, '--S': 4 } as React.CSSProperties}>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full h-full bg-transparent border-none outline-none text-sm sm:text-base text-foreground font-semibold border-b-2 border-foreground pr-6 transition-all duration-500 focus:border-primary valid:border-primary"
              />
              <label className="absolute top-1/2 left-0 transform -translate-y-1/2 text-sm sm:text-base text-foreground transition-all duration-500 pointer-events-none">
                Confirm Password
              </label>
              <Lock className="absolute top-1/2 right-0 transform -translate-y-1/2 w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-foreground transition-colors duration-500" />
            </div>

            {error && (
              <div className="animation text-red-400 text-xs sm:text-sm text-center" style={{ '--li': 20.5, '--S': 4.5 } as React.CSSProperties}>
                {error}
              </div>
            )}

            <div className="input-box animation mt-3 sm:mt-4 md:mt-5 lg:mt-6" style={{ '--li': 20, '--S': 4 } as React.CSSProperties}>
              <button
                type="submit"
                disabled={isLoading}
                className="btn relative w-full h-[40px] sm:h-[45px] bg-transparent rounded-[40px] cursor-pointer text-sm sm:text-base font-semibold border-2 border-primary overflow-hidden z-10 hover:before:top-0 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  'Register'
                )}
              </button>
            </div>

            <div className="regi-link animation text-xs sm:text-sm text-center mt-3 sm:mt-4 md:mt-5 lg:mt-6" style={{ '--li': 21, '--S': 5 } as React.CSSProperties}>
              <p className="text-foreground">
                Already have an account? <br />
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="text-primary font-semibold hover:underline transition-all duration-300"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Desktop Info Content - Login */}
        <div className={`info-content Login absolute top-0 right-0 h-full w-1/2 hidden lg:flex justify-center flex-col text-right px-8 xl:px-10 pb-16 pl-[120px] xl:pl-[150px] ${isLogin ? '' : 'opacity-0 pointer-events-none'}`}>
          <h2 className="animation uppercase text-[32px] xl:text-[36px] leading-tight text-foreground" style={{ '--D': 0, '--S': 20 } as React.CSSProperties}>
            WELCOME BACK!
          </h2>
          <p className="animation text-sm xl:text-base text-foreground mt-4" style={{ '--D': 1, '--S': 21 } as React.CSSProperties}>
            We are happy to have you with us again. If you need anything, we are here to help.
          </p>
        </div>

        {/* Desktop Info Content - Register */}
        <div className={`info-content Register absolute top-0 left-0 h-full w-1/2 hidden lg:flex justify-center flex-col text-left px-8 xl:px-10 pb-16 pr-[120px] xl:pr-[150px] pointer-events-none ${isLogin ? 'opacity-0 pointer-events-none' : ''}`}>
          <h2 className="animation uppercase text-[32px] xl:text-[36px] leading-tight text-foreground" style={{ '--li': 17, '--S': 0 } as React.CSSProperties}>
            WELCOME!
          </h2>
          <p className="animation text-sm xl:text-base text-foreground mt-4" style={{ '--li': 18, '--S': 1 } as React.CSSProperties}>
            We're delighted to have you here. If you need any assistance, feel free to reach out.
          </p>
        </div>

        {/* Mobile Info Content - Login */}
        <div className={`mobile-info-content Login absolute bottom-0 left-0 w-full h-16 sm:h-20 flex items-center justify-center text-center px-4 lg:hidden transition-all duration-700 ${isLogin ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="animation text-center">
            <h3 className="text-base sm:text-lg font-bold text-primary mb-1" style={{ '--D': 0, '--S': 20 } as React.CSSProperties}>
              WELCOME BACK!
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground" style={{ '--D': 1, '--S': 21 } as React.CSSProperties}>
              We are happy to have you with us again.
            </p>
          </div>
        </div>

        {/* Mobile Info Content - Register */}
        <div className={`mobile-info-content Register absolute bottom-0 left-0 w-full h-16 sm:h-20 flex items-center justify-center text-center px-4 lg:hidden transition-all duration-700 ${isLogin ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="animation text-center">
            <h3 className="text-base sm:text-lg font-bold text-primary mb-1" style={{ '--li': 17, '--S': 0 } as React.CSSProperties}>
              WELCOME!
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground" style={{ '--li': 18, '--S': 1 } as React.CSSProperties}>
              We're delighted to have you here.
            </p>
          </div>
        </div>

        {/* Mobile Sliding Indicator */}
        <div className="mobile-indicator absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2 lg:hidden">
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isLogin ? 'bg-primary scale-110' : 'bg-primary/30 scale-100'}`}></div>
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${!isLogin ? 'bg-primary scale-110' : 'bg-primary/30 scale-100'}`}></div>
        </div>
      </div>

      <style>{`
        /* Enhanced Desktop Animations - Curved Shapes */
        .curved-shape {
          transform: rotate(10deg) skewY(40deg);
          transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          transition-delay: 0.3s;
        }

        .curved-shape2 {
          transform: rotate(0deg) skewY(0deg);
          transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          transition-delay: 0.6s;
        }

        .auth-container.active .curved-shape {
          transform: rotate(0deg) skewY(0deg);
          transition-delay: 0.3s;
        }

        .auth-container.active .curved-shape2 {
          transform: rotate(-11deg) skewY(-41deg);
          transition-delay: 0.6s;
        }

        /* Login Form Animations */
        .form-box.Login .animation {
          transform: translateX(0%) scale(1);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
          filter: blur(0px);
          transition-delay: calc(0.05s * var(--S));
        }

        .auth-container.active .form-box.Login .animation {
          transform: translateX(-120%) scale(0.95);
          opacity: 0;
          filter: blur(8px);
          transition-delay: calc(0.05s * var(--D));
        }

        /* Login Form Animations - When switching back from Register */
        .auth-container:not(.active) .form-box.Login .animation {
          transform: translateX(0%) scale(1);
          opacity: 1;
          filter: blur(0px);
          transition-delay: calc(0.03s * var(--S));
        }

        /* Register Form Animations */
        .form-box.Register .animation {
          transform: translateX(120%) scale(0.95);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          filter: blur(8px);
          transition-delay: calc(0.05s * var(--S));
        }

        .auth-container.active .form-box.Register .animation {
          transform: translateX(0%) scale(1);
          opacity: 1;
          filter: blur(0px);
          transition-delay: calc(0.05s * var(--li));
        }

        /* Register Form Animations - When switching back to Login */
        .auth-container:not(.active) .form-box.Register .animation {
          transform: translateX(120%) scale(0.95);
          opacity: 0;
          filter: blur(8px);
          transition-delay: calc(0.02s * var(--D));
        }

        /* Login Info Content Animations */
        .info-content.Login .animation {
          transform: translateX(0%) scale(1);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          transition-delay: calc(0.05s * var(--S));
          opacity: 1;
          filter: blur(0px);
        }

        /* Login Info Content Animations - When switching back from Register */
        .auth-container:not(.active) .info-content.Login .animation {
          transform: translateX(0%) scale(1);
          opacity: 1;
          filter: blur(0px);
          transition-delay: calc(0.03s * var(--S));
        }

        /* Register Info Content Animations */
        .info-content.Register .animation {
          transform: translateX(-120%) scale(0.95);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          filter: blur(8px);
          transition-delay: calc(0.05s * var(--S));
        }

        .auth-container.active .info-content.Register .animation {
          transform: translateX(0%) scale(1);
          opacity: 1;
          filter: blur(0px);
          transition-delay: calc(0.05s * var(--li));
        }

        /* Register Info Content Animations - When switching back to Login */
        .auth-container:not(.active) .info-content.Register .animation {
          transform: translateX(-120%) scale(0.95);
          opacity: 0;
          filter: blur(8px);
          transition-delay: calc(0.02s * var(--D));
        }

        .input-box input:focus ~ label,
        .input-box input:valid ~ label {
          top: -5px;
          color: hsl(var(--primary));
        }

        .input-box input:focus ~ svg,
        .input-box input:valid ~ svg {
          color: hsl(var(--primary));
        }

        .btn::before {
          content: "";
          position: absolute;
          height: 300%;
          width: 100%;
          background: linear-gradient(hsl(var(--background)), hsl(var(--primary)), hsl(var(--background)), hsl(var(--primary)));
          top: -100%;
          left: 0;
          z-index: -1;
          transition: 0.5s;
        }

        .btn:hover::before {
          top: 0;
        }

        /* Enhanced Container Animation */
        .auth-container {
          transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .auth-container.active {
          transform: scale(1.02);
          box-shadow: 0 0 35px hsl(var(--primary) / 0.6);
        }

        /* Smooth Form Transitions */
        .form-box {
          will-change: transform, opacity, filter;
        }

        .animation {
          will-change: transform, opacity, filter;
        }

        /* Mobile-specific styles */
        @media (max-width: 1024px) {
          .auth-container {
            height: auto !important;
            min-height: 500px;
            position: relative;
            max-width: 95vw;
          }
          
          .form-box.Login,
          .form-box.Register {
            position: absolute !important;
            width: 100% !important;
            height: 100% !important;
            padding: 1.5rem 1rem !important;
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .form-box.Login {
            transform: translateX(0%) scale(1);
            opacity: 1;
            z-index: 2;
            filter: blur(0px);
          }
          
          .form-box.Register {
            transform: translateX(100%) scale(0.95);
            opacity: 0;
            z-index: 1;
            filter: blur(8px);
          }
          
          .auth-container.active .form-box.Login {
            transform: translateX(-100%) scale(0.95);
            opacity: 0;
            filter: blur(8px);
          }
          
          .auth-container.active .form-box.Register {
            transform: translateX(0%) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
          
          /* Mobile animations - When switching back to Login */
          .auth-container:not(.active) .form-box.Login {
            transform: translateX(0%) scale(1);
            opacity: 1;
            filter: blur(0px);
            transition-delay: 0.1s;
          }
          
          .auth-container:not(.active) .form-box.Register {
            transform: translateX(100%) scale(0.95);
            opacity: 0;
            filter: blur(8px);
            transition-delay: 0.05s;
          }
          
          .mobile-bg-shape {
            transform: scale(1) rotate(0deg);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0.6;
          }
          
          .mobile-bg-shape2 {
            transform: scale(1) rotate(0deg);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0.4;
          }
          
          .auth-container.active .mobile-bg-shape {
            transform: scale(1.3) rotate(180deg);
            background: linear-gradient(45deg, hsl(var(--primary) / 0.4), hsl(var(--primary) / 0.2));
            opacity: 0.8;
            transition-delay: 0.2s;
          }
          
          .auth-container.active .mobile-bg-shape2 {
            transform: scale(1.4) rotate(-180deg);
            background: linear-gradient(45deg, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.1));
            opacity: 0.6;
            transition-delay: 0.4s;
          }
          
          /* Mobile background shapes - When switching back to Login */
          .auth-container:not(.active) .mobile-bg-shape {
            transform: scale(1) rotate(0deg);
            background: linear-gradient(45deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.1));
            opacity: 0.6;
            transition-delay: 0.2s;
          }
          
          .auth-container:not(.active) .mobile-bg-shape2 {
            transform: scale(1) rotate(0deg);
            background: linear-gradient(45deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.1));
            opacity: 0.4;
            transition-delay: 0.4s;
          }
          
          .info-content {
            display: none !important;
          }
          
          .mobile-indicator {
            z-index: 10;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .mobile-indicator div {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .mobile-info-content {
            z-index: 5;
            background: linear-gradient(180deg, transparent 0%, hsl(var(--background) / 0.8) 100%);
            backdrop-filter: blur(10px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .mobile-info-content .animation {
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .auth-container {
            background: linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--background) / 0.95) 100%);
          }
        }

        /* Small mobile styles */
        @media (max-width: 480px) {
          .auth-container {
            min-height: 450px;
            margin: 1rem;
            padding: 0.5rem;
          }
          
          .form-box.Login,
          .form-box.Register {
            padding: 1rem 0.75rem !important;
          }
          
          .mobile-info-content {
            height: 14px !important;
            padding: 0.5rem !important;
          }
          
          .mobile-info-content h3 {
            font-size: 0.875rem !important;
            margin-bottom: 0.25rem !important;
          }
          
          .mobile-info-content p {
            font-size: 0.75rem !important;
          }
          
          .mobile-indicator {
            top: 0.75rem !important;
          }
        }

        /* Tablet styles */
        @media (min-width: 768px) and (max-width: 1024px) {
          .auth-container {
            max-width: 90vw;
            height: 500px;
          }
        }

        /* Large screen styles */
        @media (min-width: 1024px) {
          .auth-container {
            width: 750px;
            height: 450px;
          }
          
          .form-box.Login,
          .form-box.Register {
            padding: 2rem 1rem !important;
          }
          
          .form-box.Login h2,
          .form-box.Register h2 {
            margin-bottom: 1.5rem !important;
          }
          
          .form-box.Login form,
          .form-box.Register form {
            gap: 1rem !important;
          }
          
          .input-box {
            margin-top: 0.75rem !important;
          }
        }

        /* Extra large screen styles */
        @media (min-width: 1280px) {
          .auth-container {
            width: 800px;
            height: 500px;
          }
          
          .form-box.Login,
          .form-box.Register {
            padding: 2.5rem 1.5rem !important;
          }
          
          .form-box.Login h2,
          .form-box.Register h2 {
            margin-bottom: 2rem !important;
          }
          
          .form-box.Login form,
          .form-box.Register form {
            gap: 1.25rem !important;
          }
          
          .input-box {
            margin-top: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};