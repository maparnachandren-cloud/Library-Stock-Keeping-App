const express = require('express');

const router = express.Router();

const User = require('../models/User');

const Request = require('../models/Request');



router.get(
  '/',
  async (req, res) => {

    const users = await User.find({
      role: 'user'
    });

    res.json(users);
  }
);



router.get(
  '/:id',
  async (req, res) => {

    const user = await User.findById(
      req.params.id
    );

    res.json(user);
  }
);



router.put(
  '/:id',
  async (req, res) => {

    const updatedUser =
      await User.findByIdAndUpdate(

        req.params.id,

        req.body,

        { new: true }

      );

    res.json(updatedUser);
  }
);



router.delete(
  '/:id',
  async (req, res) => {

    const deletedUser =
      await User.findByIdAndDelete(
        req.params.id
      );

    res.json(deletedUser);
  }
);



router.put(
  '/:id/block',
  async (req, res) => {

    const updatedUser =
      await User.findByIdAndUpdate(

        req.params.id,

        {
          isBlocked:
            req.body.isBlocked
        },

        { new: true }

      );

    res.json(updatedUser);
  }
);



router.get(
  '/:userId/requests',
  async (req, res) => {

    const requests =
      await Request.find({

        userId: req.params.userId

      }).populate(
        'bookId',
        'title author'
      );

    res.json(requests);
  }
);



module.exports = router;