import React, { useState } from 'react';
import { soundService } from '../../services/soundService';

export interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'marine' | 'coral' | 'emerald' | 'gold' | 'ruby' | 'surface';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  soundType?: 'click' | 'pop' | 'correct' | 'wrong' | 'none';
  hapticIntensity?: 'light' | 'medium' | 'heavy' | 'none';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button3D: React.FC<Button3DProps> = ({
  children,
  variant = 'marine',
  size = 'md',
  fullWidth = false,
  soundType = 'click',
  hapticIntensity = 'light',
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  style,
  ...rest
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    setIsPressed(true);

    // Kích hoạt âm thanh vật lý tức thì (< 8ms)
    if (soundType === 'click') soundService.playClick();
    else if (soundType === 'pop') soundService.playPop();
    else if (soundType === 'correct') soundService.playCorrect();
    else if (soundType === 'wrong') soundService.playWrong();

    // Rung xúc giác haptic
    if (hapticIntensity === 'light') soundService.vibrate(12);
    else if (hapticIntensity === 'medium') soundService.vibrate(28);
    else if (hapticIntensity === 'heavy') soundService.vibrate([20, 15, 35]);

    rest.onPointerDown?.(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    rest.onPointerUp?.(e);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    rest.onPointerLeave?.(e);
  };

  const variantClass = `btn-duo-${variant}`;
  const sizeClass = `btn-duo-${size}`;
  const fullWidthClass = fullWidth ? 'btn-duo-full' : '';
  const pressedClass = isPressed ? 'is-pressed' : '';

  return (
    <button
      {...rest}
      disabled={disabled || isLoading}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      className={`btn-duo ${variantClass} ${sizeClass} ${fullWidthClass} ${pressedClass} ${className}`.trim()}
      style={style}
    >
      {isLoading ? (
        <span className="btn-loading-dots">
          <span>●</span>
          <span>●</span>
          <span>●</span>
        </span>
      ) : (
        <>
          {leftIcon && <span className="btn-icon-left" style={{ display: 'inline-flex', alignItems: 'center' }}>{leftIcon}</span>}
          <span className="btn-text-content">{children}</span>
          {rightIcon && <span className="btn-icon-right" style={{ display: 'inline-flex', alignItems: 'center' }}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button3D;
