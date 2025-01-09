import Product from '../models/ProductCardModel.js'; 
import { Op } from 'sequelize'; 

const searchProducts = async (req, res) => {
  try {
    const query = req.query.q; // Retrieve the search query from the request
    console.log(query)
    if (!query) {
      return res.status(400).json({ error: 'Search query cannot be empty' });
    }

    // Query the database with the search term
    const results = await Product.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`, // Perform a partial match search
        },
      },
    });
    console.log(results); 
    // Return search results
    res.status(200).json(results);
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { searchProducts };
