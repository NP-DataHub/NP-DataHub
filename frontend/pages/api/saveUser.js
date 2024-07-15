import clientPromise from '../../src/app/lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, name } = req.body;
    try {
      const client = await clientPromise;
      const db = client.db('Np-Datahub');
      const collection = db.collection('users'); 

      await collection.insertOne({ email, name, date: new Date() });

      res.status(200).json({ message: 'User saved successfully' });
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).json({ message: 'Error saving user' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
