import {readCount} from '../../lib';

export default function handler(req, res) {
      const count=readCount();
      res.status(200).json({ count });
}