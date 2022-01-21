import {makeCount} from '../../lib';

export default function handler(req, res) {
      const count=makeCount();
      res.status(200).json({ count });
}