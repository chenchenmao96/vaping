const Script = require('../models/Script.js');
const User = require('../models/User');
const Notification = require('../models/Notification');
const _ = require('lodash');

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const profile_posts = 
[ 

{
  username:"sweetietooth",
  name:"Wendy",
  pronoun:"her",
  pro_image:"Bot-SP18.17.png",
  posts: [
    {
      picture:"180320-7.jpg",
      body:"My husband got me the best cupcakes ever!",
      time:"2 Days Ago"
    },
    {
      picture:"180320-9.jpg",
      body:"Dark melty chocolate chunks 🍫 Have you tried the Dark Chocolate Chunk?",
      time:"2 Days Ago"
    },
    {
      picture:"180320-12.jpg",
      body:"Dang....that’s one sweet peachy looking cupcake 🍑 ",
      time:"3 Days Ago"
    },
    {
      picture:"180320-13.jpg",
      body:"These pastries from my hotel were the best thingsever!",
      time:"3 Days Ago"
    },
    {
      picture:"180320-8.jpg",
      body:"What A Time, To Be Alive!!! Home barbecue on the way 💗❤💗",
      time:"3 Days Ago"
    },
    {
      picture:"180320-10.jpg",
      body:"Is it really a trip to the South without a stop at Waffle House? 📷",
      time:"4 Days Ago"
    }
  ]
},

{
  username:"southerngirlCel",
  name:"Celia",
  pronoun:"her",
  pro_image:"bot43.jpg",
  posts: [
    {
      picture:"ebpost75.png",
      body:"Steak on my birthday! so lucky to have such great friends to share my special day with :):)",
      time:"2 Days Ago"
    },
    {
      picture:"ebpost76.jpg",
      body:"And the bday festivities continue!! My nana always makes the best food, there’s just always way too much!!!",
      time:"2 Days Ago"
    },
    {
      picture:"ebpost77.jpg",
      body:"croissants like these are why I love trips to the bakeries :) they make for a great phot shoot too",
      time:"3 Days Ago"
    },
    {
      picture:"ebpost78.jpg",
      body:"been trying to eat clean the last few weeks, but my sweet tooth couldn’t resist…",
      time:"3 Days Ago"
    },
    {
      picture:"ebpost79.jpg",
      body:"Steve’s in heaven! I don’t blame him, how good does that look ??!",
      time:"3 Days Ago"
    },
    {
      picture:"ebpost80.jpg",
      body:"another day, another trip to the bakery…",
      time:"4 Days Ago"
    }
  ]
},



{
  username:"MedicalRyan",
  name:"Ryan",
  pronoun:"his",
  pro_image:"Bot-Sp18.2.jpg",
  posts: [
    {
      picture:"180320-1.png",
      body:"Cheap taco is also good taco.",
      time:"2 Days Ago"
    },
    {
      picture:"180320-2.png",
      body:"Personally prefer American cheese for my tacos, but this new place around my house is decent.",
      time:"2 Days Ago"
    },
    {
      picture:"180320-3.png",
      body:"Home-made salsa by mama.",
      time:"3 Days Ago"
    },
    {
      picture:"180320-4.png",
      body:"Amazing!",
      time:"3 Days Ago"
    },
    {
      picture:"180320-5.png",
      body:"Seafood taco. Miss my lobster taco in NYC.",
      time:"3 Days Ago"
    },
    {
      picture:"180320-6.png",
      body:"Guac should never be extra. ",
      time:"4 Days Ago"
    }
  ]
}

]


/**
 * GET /
 * List of Script posts for Feed
*/
exports.getScript = (req, res, next) => {

  //req.user.createdAt
  var time_now = Date.now();
  var time_diff = time_now - req.user.createdAt;
  //var today = moment();
  //var tomorrow = moment(today).add(1, 'days');
  var time_limit = time_diff - 86400000; //one day in milliseconds

  var user_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var userAgent = req.headers['user-agent']; 

  var bully_post;
  var bully_count = 0;


  console.log("$#$#$#$#$#$#$START GET SCRIPT$#$#$$#$#$#$#$#$#$#$#$#$#");
  //console.log("time_diff  is now "+time_diff);
  //console.log("time_limit  is now "+time_limit);
  
  User.findById(req.user.id)
  .populate({ 
       path: 'posts.reply',
       model: 'Script',
       populate: {
         path: 'actor',
         model: 'Actor'
       } 
    })
  .populate({ 
       path: 'posts.actorAuthor',
       model: 'Actor'
    })
  .populate({ 
       path: 'posts.comments.actor',
       model: 'Actor'
    })
  .exec(function (err, user) {
  //User.findById(req.user.id, (err, user) => {

    //User is no longer active - study is over
    if (!user.active)
    {
      req.logout();
      req.flash('errors', { msg: 'Account is no longer active. Study is over' });
      res.redirect('/login');
    }

    user.logUser(time_now, userAgent, user_ip);

    //what day in the study are we in???
  var one_day = 86400000; //303,695,677 259,200,000
  var current_day;


  user.test = user.test + 1;
  
  //day one
  if (time_diff <= one_day)
  {
    current_day = 0;
    //add one to current day user.study_days[current_day]
    user.study_days[0] = user.study_days[0] + 1;
    user.study_days.set(0, user.study_days[0] + 1)
    //console.log("!!!DAY1 is now "+ user.study_days[0]);
  }
  //day two
  else if ((time_diff > one_day) && (time_diff <= (one_day *2))) 
  {
    current_day = 1;
    user.study_days.set(1, user.study_days[1] + 1)
    //console.log("!!!DAY2 is now "+ user.study_days[1]);
  }
  //day 3
  else if ((time_diff >(one_day *2)))
  {
    current_day = 2;
    user.study_days.set(2, user.study_days[2] + 1)
    //console.log("!!!DAY3 is now "+ user.study_days[2]);
  }
  else 
  {
    current_day = -1;
    console.log("@@@@@@@@@@_NO_DAY");
  }

  
  

    Script.find()
      .where('time').lte(time_diff).gte(time_limit)
      .sort('-time')
      .populate('actor')
      .populate({ 
       path: 'comments.actor',
       populate: {
         path: 'actor',
         model: 'Actor'
       } 
    })
      .exec(function (err, script_feed) {
        if (err) { return next(err); }
        //Successful, so render

        //update script feed to see if reading and posts has already happened
        var finalfeed = [];

        var user_posts = [];

        //Look up Notifications??? And do this as well?

        user_posts = user.getPostInPeriod(time_limit, time_diff);

        user_posts.sort(function (a, b) {
            return b.relativeTime - a.relativeTime;
          });

        while(script_feed.length || user_posts.length) {
          //console.log(typeof user_posts[0] === 'undefined');
          //console.log(user_posts[0].relativeTime);
          //console.log(feed[0].time)
          if(typeof script_feed[0] === 'undefined') {
              console.log("Script_Feed is empty, push user_posts");
              finalfeed.push(user_posts[0]);
              user_posts.splice(0,1);
          }
          else if(!(typeof user_posts[0] === 'undefined') && (script_feed[0].time < user_posts[0].relativeTime)){
              console.log("Push user_posts");
              finalfeed.push(user_posts[0]);
              user_posts.splice(0,1);
          }
          else{
            
            //console.log("ELSE PUSH FEED");
            var feedIndex = _.findIndex(user.feedAction, function(o) { return o.post == script_feed[0].id; });

             
            if(feedIndex!=-1)
            {
              console.log("WE HAVE AN ACTION!!!!!");
              
              //check to see if there are comments - if so remove ones that are not in time yet.
              //Do all comment work here for feed
              //if (Array.isArray(script_feed[0].comments) && script_feed[0].comments.length) {
              if (Array.isArray(user.feedAction[feedIndex].comments) && user.feedAction[feedIndex].comments) 
              {

                //console.log("WE HAVE COMMENTS!!!!!");
                //iterate over all comments in post - add likes, flag, etc
                for (var i = 0; i < user.feedAction[feedIndex].comments.length; i++) {
                  //i is now user.feedAction[feedIndex].comments index

                    //is this action of new user made comment we have to add???
                    if (user.feedAction[feedIndex].comments[i].new_comment)
                    {
                      //comment.new_comment
                      //console.log("adding User Made Comment into feed: "+user.feedAction[feedIndex].comments[i].new_comment_id);
                      //console.log(JSON.stringify(user.feedAction[feedIndex].comments[i]))
                      //script_feed[0].comments.push(user.feedAction[feedIndex].comments[i]);

                      var cat = new Object();
                      cat.body = user.feedAction[feedIndex].comments[i].comment_body;
                      cat.new_comment = user.feedAction[feedIndex].comments[i].new_comment;
                      cat.time = user.feedAction[feedIndex].comments[i].time;
                      cat.commentID = user.feedAction[feedIndex].comments[i].new_comment_id;
                      cat.likes = 0;

                      script_feed[0].comments.push(cat);
                      //console.log("Already have COMMENT ARRAY");
                

                    }

                    else
                    {
                      //Do something
                      //var commentIndex = _.findIndex(user.feedAction[feedIndex].comments, function(o) { return o.comment == script_feed[0].comments[i].id; });
                      var commentIndex = _.findIndex(script_feed[0].comments, function(o) { return o.id == user.feedAction[feedIndex].comments[i].comment; });
                      //If user action on Comment in Script Post
                      if(commentIndex!=-1)
                      {

                        //console.log("WE HAVE AN ACTIONS ON COMMENTS!!!!!");
                        //Action is a like (user liked this comment in this post)
                        if (user.feedAction[feedIndex].comments[i].liked)
                        { 
                          script_feed[0].comments[commentIndex].liked = true;
                          script_feed[0].comments[commentIndex].likes++;
                          //console.log("Post %o has been LIKED", script_feed[0].id);
                        }

                        //Action is a FLAG (user Flaged this comment in this post)
                        if (user.feedAction[feedIndex].comments[i].flagged)
                        { 
                          console.log("Comment %o has been LIKED", user.feedAction[feedIndex].comments[i].id);
                          script_feed[0].comments.splice(commentIndex,1);
                        }
                      }
                    }//end of ELSE

                }//end of for loop

              }//end of IF Comments

              if (user.feedAction[feedIndex].readTime[0])
              { 
                script_feed[0].read = true;
                script_feed[0].state = 'read';
                //console.log("Post: %o has been READ", script_feed[0].id);
              }
              else 
              {
                script_feed[0].read = false;
                //script_feed[0].state = 'read';
              }

              if (user.feedAction[feedIndex].liked)
              { 
                script_feed[0].like = true;
                script_feed[0].likes++;
                //console.log("Post %o has been LIKED", script_feed[0].id);
              }

              if (user.feedAction[feedIndex].replyTime[0])
              { 
                script_feed[0].reply = true;
                //console.log("Post %o has been REPLIED", script_feed[0].id);
              }

              //If this post has been flagged - remove it from FEED array (script_feed)
              if (user.feedAction[feedIndex].flagTime[0])
              { 
                script_feed.splice(0,1);
                //console.log("Post %o has been FLAGGED", script_feed[0].id);
              }

              //post is from blocked user - so remove  it from feed
              else if (user.blocked.includes(script_feed[0].actor.username))
              {
                script_feed.splice(0,1);
              }

              //if bully post && firt viewing of the day
              //&& ((req.user.createdAt + script_feed[0].comments[0].time) < time_now))
              else if ( script_feed[0].class == "bullying" && user.study_days[current_day] > 0 && bully_count == 0 && !script_feed[0].read)
              {
                //console.log("!@!@!@!@!Found a bully post and will push it");
                bully_post = script_feed[0];
                bully_count = 1;
                script_feed.splice(0,1);
              }

              else
              {
                //console.log("Post is NOT FLAGGED, ADDED TO FINAL FEED");
                finalfeed.push(script_feed[0]);
                script_feed.splice(0,1);
              }

            }//end of IF we found Feed_action

            else
            {
              //console.log("NO FEED ACTION SO, ADDED TO FINAL FEED");
              if (user.blocked.includes(script_feed[0].actor.username))
              {
                script_feed.splice(0,1);
              }

              //if bully post && firt viewing of the day
              else if ( script_feed[0].class == "bullying" && user.study_days[current_day] > 0 && bully_count == 0)
              {
                //console.log("%$%$%$%$%$%$%$Found a bully post and will push it ^2");
                bully_post = script_feed[0];
                bully_count = 1;
                script_feed.splice(0,1);
              }

              else
              {
                finalfeed.push(script_feed[0]);
                script_feed.splice(0,1);
              }
            }
            }//else in while loop
      }//while loop

      
      //shuffle up the list
      finalfeed = shuffle(finalfeed);

      if (user.study_days[current_day] > 0 && bully_post)
      {
        var bully_index = Math.floor(Math.random() * 4) + 1 
        finalfeed.splice(bully_index, 0, bully_post);
        console.log("@@@@@@@@@@ Pushed a Bully Post to index "+bully_index);
      }


      user.save((err) => {
        if (err) {
          console.log("ERROR IN USER SAVE IS "+err);
          return next(err);
        }
        //req.flash('success', { msg: 'Profile information has been updated.' });
      });

      console.log("Script Size is now: "+finalfeed.length);
      res.render('script', { script: finalfeed});

      });//end of Script.find()

    
  });//end of User.findByID

};//end of .getScript

exports.getScriptPost = (req, res) => {

  Script.findOne({ _id: req.params.id}, (err, post) => {
    console.log(post);
    res.render('script_post', { post: post });
  });
};

/**
 * GET /
 * List of Script posts for Feed
 * Made for testing
*/
exports.getScriptFeed = (req, res, next) => {

  let participantID = Math.floor(Math.random() * 5000000); // replace this with the next line once we have participantID in URL
  // let participantID = req.query.pID;

  let scriptZA = req.query.ZA;
  let scriptAL = req.query.AL;
  let scriptRV = req.query.RV;
  let scriptSN = req.query.SN;
  
  const user = new User({
    email: participantID + '@gmail.com',
    password: 'password',
    username: participantID,
    ZA: scriptZA,
    AL: scriptAL,
    RV: scriptRV,
    SN: scriptSN
  });
  
  /*User.findOne({ email: participantID + '@gmail.com'}, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: 'Account for that participant ID already exists' });
      return res.redirect('/signup'); // make sure pids are unique or this will be weird
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => { 
        if (err) {
          return next(err);
        }
      });
    });
  });*/


  user.save((err) => {


    if (err){
      console.log(err);
    }

    User.find({}, (err, users) => {
      console.log(users);
    })

    req.logIn(user, (err) => { 
      console.log("$#$#$#$#$#$#$START GET FEED$#$#$$#$#$#$#$#$#$#$#$#$#");
      //console.log("time_diff  is now "+time_diff);
      //console.log("time_limit  is now "+time_limit);
      //study2_n0_p0
      console.log("$#$#$#$#$#$#$START GET FEED$#$#$$#$#$#$#$#$#$#$#$#$#");
      var scriptFilter = "";
      // console.log('@@@@@@ what can we get from request here: ', req);
      console.log('@@@@@@ what the param has: ', req.params.caseId)

    

    // var profileFilter = req.params.caseId;
    //study3_n20, study3_n80



    console.log('what is this req.params.caseId: ', (req.params.caseId));
    // scriptFilter = req.params.caseId;

    //req.params.modId
    console.log("#############SCRIPT FILTER IS NOW " + scriptFilter);
    var time_now = Date.now();
    // var time_diff = time_now - req.user.createdAt;
    var time_diff = 0;
    //var today = moment();
    //var tomorrow = moment(today).add(1, 'days');
    var one_days = 86400000 * 1; //one day in milliseconds
    // var time_limit = time_diff - one_days; 
    
    //{
    // var scriptAL = "";
    // var scriptRV = "";
    // var scriptSN = "";
    // var scriptZA = "";

    // scriptAL = req.query.AL;
    // scriptRV = req.query.RV;
    // scriptSN = req.query.SN;
    // scriptZA = req.query.ZA;

    // console.log('PARAMETERS: ', req.params.AL, req.params.RV, req.params.SN, req.params.ZA);
    console.log('CHECK THIS NOW what: ', req.query.AL, req.query.ZA);
    console.log('Condition is : ', typeof(req.query.ZA));
      Script.find(
      {$or:[
        {"AL":scriptAL},
        {"RV":scriptRV},
        {"SN":scriptSN},
        {"ZA":scriptZA}
        ]

      })
        //change this if you want to test other parts
        // .where(scriptFilter).equals("yes")
        // .where(scriptFilter).equals(1)
        // .where('time').lte(time_diff).gte(time_limit)
        .sort('-time')
        .populate('actor')
        .populate({ 
        path: 'comments.actor',
        populate: {
          path: 'actor',
          model: 'Actor'
        } 
      })
        .exec(function (err, script_feed) {
          if (err) { return next(err); }
          //Successful, so render

          //update script feed to see if reading and posts has already happened
          var finalfeed = [];
          finalfeed = script_feed;
          // console.log('what is inside this feed???', finalfeed);

        
        //shuffle up the list
        //finalfeed = shuffle(finalfeed);

        console.log("Script Size is now: "+finalfeed.length)
        res.render('profilePic', { script: finalfeed, script_type: scriptFilter});
        
        //this is last column in matrix - the conditins will be renamed to des_5_noRules_noCommunityComment , des_30_noRules_noCommunityComment  , des_60_noRules_noCommunityComment  
        // if(scriptFilter =='r5'|| scriptFilter =='r30' ||scriptFilter =='r60')
        // {
        //   // noRules_noCommunityComment (no provacine comments) 
        //   res.render('noRules_noCommunityComment', { script: finalfeed, script_type: scriptFilter});
        // }
        // // this is the third column in the matrix
        // else if(scriptFilter =='r5_rules_noCommunity'|| scriptFilter =='r30_rules_noCommunity' ||scriptFilter =='r60_rules_noCommunity')
        // { 
        //   res.render('rules_noCommunityComment', { script: finalfeed, script_type: scriptFilter});
        // }
        // //this is the second column in the matrxi
        // else if(scriptFilter =="des_5_community_injunctive" || scriptFilter =="des_30_community_injunctive" || scriptFilter =="des_60_community_injunctive")
        // {
        //   // descriptive-community injunctive  (provaccine comments)
        //   res.render('noRules_CommunityComment', { script: finalfeed, script_type: scriptFilter});
        // }
        // //this is the first column in the matrix rules_CommunityComment
        // else if(scriptFilter =='des_5_injunctive_platform'|| scriptFilter=='des_30_injunctive_platform' || scriptFilter =='des_60_injunctive_platform')
        // {
        //   res.render('rules_CommunityComment', { script: finalfeed, script_type: scriptFilter});
        // }
        // 5, 30, 60 % + rules + community
        // else if(scriptFilter =='des_20_injunctive_platform_community'|| scriptFilter =='des_80_injunctive_platform_community ' || scriptFilter=='des_60_injunctive_platform_community')
        // {
        //   // NEED TO ADD THE RULES..SCTICKER..
        //   // descriptive-platform injunctive
        // res.render('study1-injunctive', { script: finalfeed, script_type: scriptFilter});
        // }       
        // res.render('pilot-study1-test', { script: finalfeed, comment_type: comment_type, script_type: scriptFilter});
        // res.render('feed_pilot', { script: finalfeed, script_type: scriptFilter});
        });//end of Script.find()
    })
  })  
};//end of .getScript
/*
##############
NEW POST
#############
*/
exports.newPost = (req, res) => {

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }

    //var lastFive = user.id.substr(user.id.length - 5);
   // console.log(lastFive +" just called to create a new post");
    //console.log("OG file name is "+req.file.originalname);
    //console.log("Actual file name is "+req.file.filename);
    console.log("###########NEW POST###########");
    console.log("Text Body of Post is "+req.body.body);

    var post = new Object();
    post.body = req.body.body;
    post.absTime = Date.now();
    post.relativeTime = post.absTime - user.createdAt;

    //if numPost/etc never existed yet, make it here - should never happen in new users
    if (!(user.numPosts) && user.numPosts < -1)
    {
      user.numPosts = -1;
      console.log("numPost is "+user.numPosts);
    }

    if (!(user.numReplies) && user.numReplies < -1)
    {
      user.numReplies = -1;
      console.log("numReplies is "+user.numReplies);
    }

    if (!(user.numActorReplies) && user.numActorReplies < -1)
    {
      user.numActorReplies = -1;
      console.log("numActorReplies is "+user.numActorReplies);
    }

    //This is a new post - not comment or reply
    if (req.file)
    {
      console.log("Text PICTURE of Post is "+req.file.filename);
      post.picture = req.file.filename;

      user.numPosts = user.numPosts + 1;
      post.postID = user.numPosts;
      post.type = "user_post";
      post.comments = [];
      

      //Now we find any Actor Replies (Comments) that go along with it
      Notification.find()
        .where('userPost').equals(post.postID)
        .where('notificationType').equals('reply')
        .populate('actor')
        .exec(function (err, actor_replies) {
          if (err) { return next(err); }
          //console.log("%^%^%^^%INSIDE NOTIFICATION&^&^&^&^&^&^&");
          if (actor_replies.length > 0)
          {
            //we have a actor reply that goes with this userPost
            //add them to the posts array

            //console.log("@@@@@@@We have Actor Comments to add: "+actor_replies.length);
            for (var i = 0, len = actor_replies.length; i < len; i++) {
              var tmp_actor_reply = new Object();

              //actual actor reply information
              tmp_actor_reply.body = actor_replies[i].replyBody;
              //tmp_actor_reply.actorReplyID = actor_replies[i].replyBody;
              //might need to change to above
              user.numActorReplies = user.numActorReplies + 1;
              tmp_actor_reply.commentID = user.numActorReplies;
              tmp_actor_reply.actor = actor_replies[i].actor;

              tmp_actor_reply.time = post.relativeTime + actor_replies[i].time;

              //add to posts
              post.comments.push(tmp_actor_reply);

              

            }

            
          }//end of IF

          //console.log("numPost is now "+user.numPosts);
          user.posts.unshift(post);
          //console.log("CREATING NEW POST!!!");

          user.save((err) => {
            if (err) {
              return next(err);
            }
            //req.flash('success', { msg: 'Profile information has been updated.' });
            res.redirect('/');
          });

        });//of of Notification

    }

    else if (req.body.reply)
    {
      post.reply = req.body.reply;
      post.type = "user_reply";
      user.numReplies = user.numReplies + 1;
      post.replyID = user.numReplies; //all reply posts are -1 as ID
      
      user.posts.unshift(post);
      console.log("CREATING REPLY");

      user.save((err) => {
        if (err) {
          return next(err);
        }
        
        res.redirect('/');
      });

    }

    else
    {
      console.log("@#@#@#@#@#@#@#ERROR: Oh Snap, Made a Post but not reply or Pic")
      req.flash('errors', { msg: 'ERROR: Your post or reply did not get sent' });
      res.redirect('/');
    }

  });
};

/**
 * POST /feed/
 * Update user's profie feed posts Actions.
 */
exports.postUpdateFeedAction = (req, res, next) => {

  User.findById(req.user.id, (err, user) => {
    //somehow user does not exist here
    if (err) { return next(err); }

    console.log("@@@@@@@@@@@ TOP postID is  ", req.body.postID);

    //find the object from the right post in feed 
    var feedIndex = _.findIndex(user.feedAction, function(o) { return o.post == req.body.postID; });

    console.log("@@@ USER index is  ", feedIndex);

    if(feedIndex==-1)
    {
      //Post does not exist yet in User DB, so we have to add it now
      //console.log("$$$$$Making new feedAction Object! at post ", req.body.postID);
      var cat = new Object();
      cat.post = req.body.postID;
      if(!(req.body.start))
        {
          console.log("!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!No start");
        }
      cat.startTime = req.body.start || 0;
      cat.rereadTimes = 0;
      //add new post into feedAction
      user.feedAction.push(cat);

    }
    else
    {
      //we found the right post, and feedIndex is the right index for it
      console.log("##### FOUND post "+req.body.postID+" at index "+ feedIndex);

      //create a new Comment
      if(req.body.new_comment)
      {
         
          var cat = new Object();
          cat.new_comment = true;
          user.numReplies = user.numReplies + 1;
          cat.new_comment_id = user.numReplies; 
          cat.comment_body = req.body.comment_text;
          //console.log("Start Time is: "+user.feedAction[feedIndex].startTime);
          //console.log("DATE Time is: "+req.body.new_comment);
          cat.commentTime = req.body.new_comment - user.feedAction[feedIndex].startTime;
          //console.log("Comment Time is: "+cat.commentTime);

          //create a new cat.comment id for USER replies here to do actions on them. Empty now

          cat.absTime = Date.now();
          cat.time = cat.absTime - user.createdAt;
          user.feedAction[feedIndex].comments.push(cat);
          user.feedAction[feedIndex].replyTime = [cat.time];
        
          //console.log("$#$#$#$#$#$$New  USER COMMENT Time: ", cat.commentTime);
      }

      //Are we doing anything with a comment?
      else if(req.body.commentID)
      {
        var commentIndex = _.findIndex(user.feedAction[feedIndex].comments, function(o) { return o.comment == req.body.commentID; });

        //no comment in this post-actions yet
        if(commentIndex==-1)
        {
          var cat = new Object();
          cat.comment = req.body.commentID;
          user.feedAction[feedIndex].comments.push(cat);
          commentIndex = 0;
        }

        //LIKE A COMMENT
        if(req.body.like)
        {
          let like = req.body.like - user.feedAction[feedIndex].startTime
          //console.log("!!!!!!New FIRST COMMENT LIKE Time: ", like);
          if (user.feedAction[feedIndex].comments[commentIndex].likeTime)
          {
            user.feedAction[feedIndex].comments[commentIndex].likeTime.push(like);

          }
          else
          {
            user.feedAction[feedIndex].comments[commentIndex].likeTime = [like];
            //console.log("!!!!!!!adding FIRST COMMENT LIKE time [0] now which is  ", user.feedAction[feedIndex].likeTime[0]);
          }
          user.feedAction[feedIndex].comments[commentIndex].liked = true;
          
        }

        //FLAG A COMMENT
        else if(req.body.flag)
        {
          let flag = req.body.flag - user.feedAction[feedIndex].startTime
          //console.log("!!!!!!New FIRST COMMENT flag Time: ", flag);
          if (user.feedAction[feedIndex].comments[commentIndex].flagTime)
          {
            user.feedAction[feedIndex].comments[commentIndex].flagTime.push(flag);

          }
          else
          {
            user.feedAction[feedIndex].comments[commentIndex].flagTime = [flag];
            //console.log("!!!!!!!adding FIRST COMMENT flag time [0] now which is  ", user.feedAction[feedIndex].flagTime[0]);
          }
          user.feedAction[feedIndex].comments[commentIndex].flagged = true;
          
        }

      }//end of all comment junk

      //not a comment - its a post action
      else
      {
        //update to new StartTime
        if (req.body.start && (req.body.start > user.feedAction[feedIndex].startTime))
        { 
          //console.log("%%%%%% USER.feedAction.startTime  ", user.feedAction[feedIndex].startTime);
          user.feedAction[feedIndex].startTime = req.body.start;
          user.feedAction[feedIndex].rereadTimes++;
          //console.log("%%%%%% NEW START time is now  ", user.feedAction[feedIndex].startTime);
          //console.log("%%%%%% reRead counter is now  ", user.feedAction[feedIndex].rereadTimes); 

        }

        //array of readTimes is empty and we have a new READ event
        else if ((!user.feedAction[feedIndex].readTime)&&req.body.read && (req.body.read > user.feedAction[feedIndex].startTime))
        { 
          let read = req.body.read - user.feedAction[feedIndex].startTime
          //console.log("!!!!!New FIRST READ Time: ", read);
          user.feedAction[feedIndex].readTime = [read];
          //console.log("!!!!!adding FIRST READ time [0] now which is  ", user.feedAction[feedIndex].readTime[0]);
        }

        //Already have a readTime Array, New READ event, need to add this to readTime array
        else if ((user.feedAction[feedIndex].readTime)&&req.body.read && (req.body.read > user.feedAction[feedIndex].startTime))
        { 
          let read = req.body.read - user.feedAction[feedIndex].startTime
          //console.log("%%%%%Add new Read Time: ", read);
          user.feedAction[feedIndex].readTime.push(read);
        }

        //array of flagTime is empty and we have a new (first) Flag event
        else if ((!user.feedAction[feedIndex].flagTime)&&req.body.flag && (req.body.flag > user.feedAction[feedIndex].startTime))
        { 
          let flag = req.body.flag - user.feedAction[feedIndex].startTime
          //console.log("!!!!!New FIRST FLAG Time: ", flag);
          user.feedAction[feedIndex].flagTime = [flag];
          //console.log("!!!!!adding FIRST FLAG time [0] now which is  ", user.feedAction[feedIndex].flagTime[0]);
        }

        //Already have a flagTime Array, New FLAG event, need to add this to flagTime array
        else if ((user.feedAction[feedIndex].flagTime)&&req.body.flag && (req.body.flag > user.feedAction[feedIndex].startTime))
        { 
          let flag = req.body.flag - user.feedAction[feedIndex].startTime
          //console.log("%%%%%Add new FLAG Time: ", flag);
          user.feedAction[feedIndex].flagTime.push(flag);
        }

        //array of likeTime is empty and we have a new (first) LIKE event
        else if ((!user.feedAction[feedIndex].likeTime)&&req.body.like && (req.body.like > user.feedAction[feedIndex].startTime))
        { 
          let like = req.body.like - user.feedAction[feedIndex].startTime
          //console.log("!!!!!!New FIRST LIKE Time: ", like);
          user.feedAction[feedIndex].likeTime = [like];
          user.feedAction[feedIndex].liked = true;
          //console.log("!!!!!!!adding FIRST LIKE time [0] now which is  ", user.feedAction[feedIndex].likeTime[0]);
        }

        //Already have a likeTime Array, New LIKE event, need to add this to likeTime array
        else if ((user.feedAction[feedIndex].likeTime)&&req.body.like && (req.body.like > user.feedAction[feedIndex].startTime))
        { 
          let like = req.body.like - user.feedAction[feedIndex].startTime
          //console.log("%%%%%Add new LIKE Time: ", like);
          user.feedAction[feedIndex].likeTime.push(like);
          if(user.feedAction[feedIndex].liked)
          {
            user.feedAction[feedIndex].liked = false;
          }
          else
          {
            user.feedAction[feedIndex].liked = true;
          }
        }

        //array of replyTime is empty and we have a new (first) REPLY event
        else if ((!user.feedAction[feedIndex].replyTime)&&req.body.reply && (req.body.reply > user.feedAction[feedIndex].startTime))
        { 
          let reply = req.body.reply - user.feedAction[feedIndex].startTime
          //console.log("!!!!!!!New FIRST REPLY Time: ", reply);
          user.feedAction[feedIndex].replyTime = [reply];
          //console.log("!!!!!!!adding FIRST REPLY time [0] now which is  ", user.feedAction[feedIndex].replyTime[0]);
        }

        //Already have a replyTime Array, New REPLY event, need to add this to replyTime array
        else if ((user.feedAction[feedIndex].replyTime)&&req.body.reply && (req.body.reply > user.feedAction[feedIndex].startTime))
        { 
          let reply = req.body.reply - user.feedAction[feedIndex].startTime
          //console.log("%%%%%Add new REPLY Time: ", reply);
          user.feedAction[feedIndex].replyTime.push(reply);
        }

        else
        {
          //console.log("Got a POST that did not fit anything. Possible Error.")
        }
      }//else ALL POST ACTIONS IF/ELSES

       //console.log("####### END OF ELSE post at index "+ feedIndex);

    }
    //console.log("@@@@@@@@@@@ ABOUT TO SAVE TO DB on Post ", req.body.postID);
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'Something in feedAction went crazy. You should never see this.' });

          return res.redirect('/');
        }
        console.log("ERROR ON FEED_ACTION SAVE")
        console.log(JSON.stringify(req.body));
        console.log(err);
        return next(err);
      }
      //req.flash('success', { msg: 'Profile information has been updated.' });
      //res.redirect('/account');
      //console.log("@@@@@@@@@@@ SAVED TO DB!!!!!!!!! ");
      res.send({result:"success"});
    });
  });
};

/**
 * POST /pro_feed/
 * Update user's profile feed posts Actions.
 getUserPostByID
 */
exports.postUpdateProFeedAction = (req, res, next) => {

  User.findById(req.user.id, (err, user) => {
    //somehow user does not exist here
    if (err) { return next(err); }

    console.log("@@@@@@@@@@@ TOP profile is  ", req.body.postID);

    //find the object from the right post in feed 
    var feedIndex = _.findIndex(user.profile_feed, function(o) { return o.profile == req.body.postID; });

    console.log("index is  ", feedIndex);

    if(feedIndex==-1)
    {
      //Profile does not exist yet in User DB, so we have to add it now
      console.log("$$$$$Making new profile_feed Object! at post ", req.body.postID);
      var cat = new Object();
      cat.profile = req.body.postID;
      if(!(req.body.start))
        {
          console.log("!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!No start");
        }
      cat.startTime = req.body.start;
      cat.rereadTimes = 0;
      //add new post into feedAction
      user.profile_feed.push(cat);

    }
    else
    {
      //we found the right post, and feedIndex is the right index for it
      console.log("##### FOUND post "+req.body.postID+" at index "+ feedIndex);

      //update to new StartTime
      if (req.body.start && (req.body.start > user.profile_feed[feedIndex].startTime))
      { 
        
        user.profile_feed[feedIndex].startTime = req.body.start;
        user.profile_feed[feedIndex].rereadTimes++;

      }

      //array of readTimes is empty and we have a new READ event
      else if ((!user.profile_feed[feedIndex].readTime)&&req.body.read && (req.body.read > user.profile_feed[feedIndex].startTime))
      { 
        let read = req.body.read - user.profile_feed[feedIndex].startTime
        //console.log("!!!!!New FIRST READ Time: ", read);
        user.profile_feed[feedIndex].readTime = [read];
        //console.log("!!!!!adding FIRST READ time [0] now which is  ", user.feedAction[feedIndex].readTime[0]);
      }

      //Already have a readTime Array, New READ event, need to add this to readTime array
      else if ((user.profile_feed[feedIndex].readTime)&&req.body.read && (req.body.read > user.profile_feed[feedIndex].startTime))
      { 
        let read = req.body.read - user.profile_feed[feedIndex].startTime
        //console.log("%%%%%Add new Read Time: ", read);
        user.profile_feed[feedIndex].readTime.push(read);
      }

      //array of picture_clicks is empty and we have a new (first) picture_clicks event
      else if ((!user.profile_feed[feedIndex].picture_clicks)&&req.body.picture && (req.body.picture > user.profile_feed[feedIndex].startTime))
      { 
        let picture = req.body.picture - user.profile_feed[feedIndex].startTime
        console.log("!!!!!New FIRST picture Time: ", picture);
        user.profile_feed[feedIndex].picture_clicks = [picture];
        console.log("!!!!!adding FIRST picture time [0] now which is  ", user.profile_feed[feedIndex].picture_clicks[0]);
      }

      //Already have a picture_clicks Array, New PICTURE event, need to add this to picture_clicks array
      else if ((user.profile_feed[feedIndex].picture_clicks)&&req.body.picture && (req.body.picture > user.profile_feed[feedIndex].startTime))
      { 
        let picture = req.body.picture - user.profile_feed[feedIndex].startTime
        console.log("%%%%%Add new PICTURE Time: ", picture);
        user.profile_feed[feedIndex].picture_clicks.push(picture);
      }

      else
      {
        console.log("Got a POST that did not fit anything. Possible Error.")
      }

       //console.log("####### END OF ELSE post at index "+ feedIndex);

    }//else 

    //console.log("@@@@@@@@@@@ ABOUT TO SAVE TO DB on Post ", req.body.postID);
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'Something in profile_feed went crazy. You should never see this.' });

          return res.redirect('/');
        }
        console.log(err);
        return next(err);
      }
      //req.flash('success', { msg: 'Profile information has been updated.' });
      //res.redirect('/account');
      //console.log("@@@@@@@@@@@ SAVED TO DB!!!!!!!!! ");
      res.send({result:"success"});
    });
  });
};

/**
 * POST /userPost_feed/
 * Update user's POST feed Actions.
 */
exports.postUpdateUserPostFeedAction = (req, res, next) => {

  User.findById(req.user.id, (err, user) => {
    //somehow user does not exist here
    if (err) { return next(err); }

    console.log("@@@@@@@@@@@ TOP USER profile is  ", req.body.postID);

    //find the object from the right post in feed 
    var feedIndex = _.findIndex(user.posts, function(o) { return o.postID == req.body.postID; });

    console.log("User Posts index is  ", feedIndex);

    if(feedIndex==-1)
    {
      //User Post does  not exist yet, This is an error
      console.log("$$$$$ERROR: Can not find User POST ID: ", req.body.postID);

    }

   //create a new Comment
    else if(req.body.new_comment)
    {
        var cat = new Object();
        cat.new_comment = true;
        user.numReplies = user.numReplies + 1;
        cat.commentID = 900 + user.numReplies; //this is so it doesn't get mixed with actor comments
        cat.body = req.body.comment_text;
        cat.isUser = true;
        cat.absTime = Date.now();
        cat.time = cat.absTime - user.createdAt;
        user.posts[feedIndex].comments.push(cat);
        console.log("$#$#$#$#$#$$New  USER COMMENT Time: ", cat.time);
    }

    //Are we doing anything with a comment?
    else if(req.body.commentID)
    {
      var commentIndex = _.findIndex(user.posts[feedIndex].comments, function(o) { return o.commentID == req.body.commentID; });

      //no comment in this post-actions yet
      if(commentIndex==-1)
      {
        console.log("!!!!!!Error: Can not find Comment for some reason!");
      }

      //LIKE A COMMENT
      else if(req.body.like)
      {

        console.log("%^%^%^%^%^%User Post comments LIKE was: ", user.posts[feedIndex].comments[commentIndex].liked);
        user.posts[feedIndex].comments[commentIndex].liked = user.posts[feedIndex].comments[commentIndex].liked ? false : true;        
        console.log("^&^&^&^&^&User Post comments LIKE was: ", user.posts[feedIndex].comments[commentIndex].liked);
      }

      //FLAG A COMMENT
      else if(req.body.flag)
      {
        console.log("%^%^%^%^%^%User Post comments FLAG was: ", user.posts[feedIndex].comments[commentIndex].flagged);
        user.posts[feedIndex].comments[commentIndex].flagged = user.posts[feedIndex].comments[commentIndex].flagged ? false : true;
        console.log("%^%^%^%^%^%User Post comments FLAG was: ", user.posts[feedIndex].comments[commentIndex].flagged);
      }

    }//end of all comment junk

    else
    {
      //we found the right post, and feedIndex is the right index for it
      console.log("##### FOUND post "+req.body.postID+" at index "+ feedIndex);


        //array of likeTime is empty and we have a new (first) LIKE event
        if (req.body.like)
        { 
          
          console.log("!!!!!!User Post LIKE was: ", user.posts[feedIndex].liked);
          user.posts[feedIndex].liked = user.posts[feedIndex].liked ? false : true;
          console.log("!!!!!!User Post LIKE is now: ", user.posts[feedIndex].liked);
        }


      else
      {
        console.log("Got a POST that did not fit anything. Possible Error.")
      }

    }//else 

    //console.log("@@@@@@@@@@@ ABOUT TO SAVE TO DB on Post ", req.body.postID);
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'Something in profile_feed went crazy. You should never see this.' });

          return res.redirect('/');
        }
        console.log(err);
        return next(err);
      }
      //req.flash('success', { msg: 'Profile information has been updated.' });
      //res.redirect('/account');
      //console.log("@@@@@@@@@@@ SAVED TO DB!!!!!!!!! ");
      res.send({result:"success"});
    });
  });
}

