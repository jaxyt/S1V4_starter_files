const express = require('express');
const router = express.Router();
const records = require('./records');

function asyncHandler(cb){
    return async (req, res, next)=>{
      try {
        await cb(req,res, next);
      } catch(err){
        next(err);
      }
    };
  }


// Send a GET request to /quotes to READ a list of quotes
router.get('/quotes', async (req, res, next)=>{
    try {
        const quotes = await records.getQuotes();
        res.status(200).json(quotes);
    } catch (err) {
        next(err);
    }
});

// Send a GET request to /quotes/:id to READ(view) a quote
router.get('/quotes/:id', async (req, res, next)=>{
    try {
        const quote = await records.getQuote(req.params.id);
        if (quote) {
            res.status(200).json(quote); 
        } else {
            res.status(404).json({message: "the specified quote could not be found"})
        }
    } catch (err) {
        next(err);
    }
});

// Send a POST request to /quotes to CREATE a new quote
router.post('/quotes', async (req, res, next)=>{
    try {
        if (req.body.author && req.body.quote) {
            const quote = await records.createQuote({
                quote: req.body.quote,
                author: req.body.author
            });
            res.status(201).json(await records.getQuote(quote.id));
        } else {
            res.status(400).json({message: "A quote and an author are required to create a new quote"})
        }
    } catch (err) {
        next(err);
    }
});

// Send a PUT request to /quotes/:id to UPDATE (edit) a quote
router.put('/quotes/:id', async (req, res, next)=>{
    try {
        const quote = await records.getQuote(req.params.id);
        if (quote) {
            if (req.body.author && req.body.quote) {
                quote.quote = req.body.quote;
                quote.author = req.body.author
                await records.updateQuote(quote);
                res.status(204).end();
            } else {
                res.status(400).json({message: "A quote and an author are required to create a new quote"})
            }
        } else {
            res.status(404).json({message: "The quote you are attempting to update does not exist"});
        }
    } catch (err) {
        next(err);
    }
});

// Send a DELETE request to /quotes/:id to DELETE a quote
router.delete('/quotes/:id', async (req, res, next)=>{
    try {
        const quote = await records.getQuote(req.params.id);
        if (quote) {
            await records.deleteQuote(quote);
            res.status(204).end();
        } else {
            res.status(404).json({message: "The quote you are looking for does not exist"});
        }
    } catch (err) {
        next(err);
    }
});

// Send a GET request to /quotes/quote/random to READ(view) a random quote
router.get('/quotes/quote/random', async (req, res, next)=>{
    try {
        const quote = await records.getRandomQuote();
        res.json(quote);
    } catch (err) {
        next(err);
    }
});


module.exports = router;