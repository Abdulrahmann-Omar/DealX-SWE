import express from 'express';
import User from '../models/user.js'; 

const ProfileRouter = express.Router();


ProfileRouter.get('/' , async(req , res)=> { 
  try {
    console.log('Server is running');
  
  }catch{
    console.log('Error');
  }
})

// ProfileRouter.get('/:id', async (req, res) => {
//   try {
//     const user = await User.findByPk(req.params.id, {
//       attributes: ['user_id', 'username', 'email', 'full_name', 'address', 'phone_number'],
//     });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user);
//   } catch (err) {
//     console.error('Error fetching user profile:', err.message);
//     res.status(500).json({ error: 'Failed to fetch profile' });
//   }
// });

ProfileRouter.put('/:id', async (req, res) => {
  const { username, email, full_name, address, phone_number } = req.body;

  try {
    const [updated] = await User.update(
      { username, email, full_name, address, phone_number },
      { where: { user_id: req.params.id } }
    );

    if (updated === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating user profile:', err.message);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

ProfileRouter.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { user_id: req.params.id },
    });

    if (deleted === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile deleted successfully' });
  } catch (err) {
    console.error('Error deleting user profile:', err.message);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

export {ProfileRouter};