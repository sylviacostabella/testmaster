const express = require('express')
const { createReportComment } = require('../db/index');
const apiRouter = express.Router();

// Import the database adapter functions from the db
const { getOpenReports ,closeReport ,expireReport } = require('../db');

// app.use('/api', apiRouter);

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
// Build an apiRouter using express Router


apiRouter.get('/', (req, res) => {
  console.log('router is working');
  res.json({ success: 'ok' });
})

/**
 * Set up a GET request for /reports
 * 
 * - it should use an async function
 * - it should await a call to getOpenReports
 * - on success, it should send back an object like { reports: theReports }
 * - on caught error, call next(error)
 */
apiRouter.get('/reports', async (req, res, next) => {
  
    try {

      const theReports = await getOpenReports();
  
      res.json({ reports: theReports });

      
    } catch (error) {
      next(error);
    }
  });


/**
 * Set up a POST request for /reports
 * 
 * - it should use an async function
 * - it should await a call to createReport, passing in the fields from req.body
 * - on success, it should send back the object returned by createReport
 * - on caught error, call next(error)
 */


apiRouter.post('/reports', async (req, res, next) => {
  console.log('POST :: /report ===========')
  try {
    const report = await createReport(req.body);
    
    res.send(report);
  } catch (error) {
    next(error);
  }
});

// async function createReport(fields) {
//   const report = {
//     id: 1,
//     title: fields.title,
//     description: fields.description,
//   };

//   return report;
// }



/**
 * Set up a DELETE request for /reports/:reportId
 * 
 * - it should use an async function
 * - it should await a call to closeReport, passing in the reportId from req.params
 *   and the password from req.body
 * - on success, it should send back the object returned by closeReport
 * - on caught error, call next(error)
 */

apiRouter.delete('/reports/:reportId', async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const { password } = req.body;

    const result = await closeReport(reportId, password);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * Set up a POST request for /reports/:reportId/comments
 * 
 * - it should use an async function
 * - it should await a call to createReportComment, passing in the reportId and
 *   the fields from req.body
 * - on success, it should send back the object returned by createReportComment
 * - on caught error, call next(error)
 */
apiRouter.post('/reports/:reportId/comments', async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const { fields } = req.body;

    const comment = await createReportComment(reportId, fields);

    res.json(comment);
  } catch (error) {
    next(error);
  }
});


module.exports = apiRouter;


// Export the apiRouter
