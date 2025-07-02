import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export function LoginForm({ onLogin }: { onLogin: (password: string) => void }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (password === '2024sfzs@MVP') {
        onLogin(password);
      } else {
        setError('密码错误，请重试');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full animate-morandi-fade-in">
        <div className="card-morandi text-center">
          <div className="logo-container justify-center mb-8">
            <img src="/mvplogo.png" alt="MVP Logo" className="h-12 w-auto" />
            <div>
              <h1 className="text-2xl font-semibold text-[var(--morandi-stone)]">十方众声 MCN</h1>
              <p className="text-[var(--morandi-mist)] text-sm mt-1">管理系统登录</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-left">
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-3">系统密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-morandi"
                  placeholder="请输入系统密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--morandi-mist)] hover:text-[var(--morandi-cloud)] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error && <p className="text-[var(--morandi-rose)] text-sm mt-3">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="btn-morandi-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-morandi-spin" />
                  验证中...
                </>
              ) : (
                '进入系统'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-[var(--morandi-mist)]">Mega Volume Production MCN Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
}