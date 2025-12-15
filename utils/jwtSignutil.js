import jwt from 'jsonwebtoken';

export const getJwtToken = (user_id, username) => {
  const payload = {
    user_id: user_id,
    username: username
  }
  
  return jwt.sign(payload, 'APP_JWT_SECRET', {
    expiresIn: '15m' // Token berlaku selama 15 menit
  });
}

