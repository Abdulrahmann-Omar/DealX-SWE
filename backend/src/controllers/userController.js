import User from '../models/user.js';

export const getUser = async (req, res) => {
  const { email, password_hash } = req.body;

  if (!email || !password_hash) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    console.log('Fetching user from the database...');
    const start = Date.now(); 
    
    const user = await User.findOne({
      where: { email, password_hash },
    });
    
    const end = Date.now(); 
    console.log(`Query execution time: ${end - start}ms`);
    
    if (user) {
      // req.session.existingUser = {
      //   id: existingUser.id,
      //   username: existingUser.username,
      //   email: existingUser.email,
      //   address: existingUser.address,
      //   phone_number: existingUser.phone_number,
      //   full_name: existingUser.full_name,
      //   type: existingUser.type,
      // };
      
      console.log('User found:', user);
      
      return res.status(200).json({ message: 'User exists', user: User });
    } else {
      console.log('No user found with the provided credentials.');
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'An error occurred', error });
  }
};

export const createUser = async (req, res) => {
  const { username, email, address, phone_number, password_hash, full_name, type = 'admin' } = req.body;

  if (!username || !email || !password_hash || !full_name) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    console.log('Creating a new user...');
    const user = await User.create({
      username,
      email,
      address,
      phone_number,
      password_hash,
      full_name,
      type,
    });

    console.log('User created successfully:', user);
    return res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Error creating user', error });
  }
};
