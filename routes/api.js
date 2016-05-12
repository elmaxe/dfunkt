var express = require('express');
var models = require('../models');
var router  = express.Router();
var moment = require('moment');

//
// API:
// - lista alla användare
// - lista en specifik användare och dess nuvarande roller
// - lista en specifik användare och dess nuvarande och gamla roller
// - lista alla roller av en viss typ med senaste
// - lista alla roller av en viss typ med all historik
// - lista alla roller med senaste
// - lista alla roller med all historik
// - lista en specifik roll med nuvarande
// - lista en specifik roll med all historik
//

router.get('/users', function(req, res) {
  models.User.findAll({}).then(function(users) {
    res.json(users);
  });
});

router.get('/user/kthid/:kthid', function(req, res) {
  models.User.findOne({where: {kthid:req.params.kthid}}).then(function(user) {
    getUserMandates(user, res);
  });
});

router.get('/user/kthid/:kthid/current', function(req, res) {
  models.User.findOne({where: {kthid:req.params.kthid}}).then(function(user) {
    getUserMandatesCurrent(user, res);
  });
});

router.get('/user/ugkthid/:ugkthid', function(req, res) {
  models.User.findOne({where: {ugkthid:req.params.ugkthid}}).then(function(user) {
    getUserMandates(user, res);
  });
});

router.get('/user/ugkthid/:ugkthid/current', function(req, res) {
  models.User.findOne({where: {ugkthid:req.params.ugkthid}}).then(function(user) {
    getUserMandatesCurrent(user, res);
  });
});

//Returns the user and mandates for him.
var getUserMandatesCurrent = function(user, res) {
  if(!user) {
    res.status(404);
    res.send("does not exist");
  } else {
    var now = new moment().format('YYYY-MM-DD');
    models.Mandate.findAll({
      where: {UserId: user.id, end: {$gte: now}, start: {$lte: now}},
      attributes: ['start', 'end'],
      include: [{
        model: models.Role,
        attributes: ['title', 'email']
      }]
    }).then(function(mandates) {
      res.json({
        user: user,
        mandates: mandates
      });
    });
  }
}

var getUserMandates = function(user, res) {
  if(!user) {
    res.status(404);
    res.send("does not exist");
  } else {
    models.Mandate.findAll({
      where: {UserId: user.id},
      attributes: ['start', 'end'],
      include: [{
        model: models.Role,
        attributes: ['title', 'email']
      }]
    }).then(function(mandates) {
      res.json({
        user: user,
        mandates: mandates
      });
    });
  }
}

router.get("/:RoleId/list", function(req, res) {
  models.Role.findById(req.params.RoleId, {
    attributes: ["title", "description", "email"], 
  }).then(function(role) {
    models.Mandate.findAll({
      where: {RoleId: req.params.RoleId,},
      attributes: ["start", "end"],
      include: [{
	model: models.User, 
	attributes: ["first_name", "kthid"], //TODO: fix
      }],
    }).then(function(mandates) {
      res.json({
	title:  role.title,
	description: role.description,
	email: role.email,
	mandates: mandates,
      });
    });
  });
});

router.get('/list', function(req, res) {
  models.Role.findAll({
    attributes: ["title", "description", "email", "id"],
  }).then(function(roles) {
    models.Mandate.findAll({
      attributes: ["start", "end", "RoleId"],
      include: [{
	model: models.User, 
	attributes: ["first_name", "kthid"], //TODO: fix
      }],
    }).then(function(mandates) {
      res.json({roles: roles.map(function(role){
	return jsonRenderRole(role, mandates);
      })});
    });
  });
});

function jsonRenderRole(role, allMandates) {
  function byId(mandate) {
    return mandate.RoleId === role.id;
  };

  return {
    title:  role.title,
    description: role.description,
    email: role.email,
    mandates: mostRecentMandate(allMandates.filter(byId)),
  };
}

function mostRecentMandate(mandates) {
  if (mandates.length == 0) {
    return [];
  } else {
    return mandates.reduce(function(prev, curr) {
      if (curr.end > prev.end) {
	return curr;
      } else {
	return prev;
      }
    });
  }
}

module.exports = router;