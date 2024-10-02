import jwt from 'jsonwebtoken';

const createToken = async (res, id) => {
  try {
    const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: '30d' }); 
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'Strict', 
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  } catch (error) {
    console.error("Error creating token:", error);
  }
};

export default createToken;
