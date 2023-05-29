// Require the Client constructor from the pg package

// Create a constant, CONNECTION_STRING, from either process.env.DATABASE_URL or postgres://localhost:5432/phenomena-dev

// Create the client using new Client(CONNECTION_STRING)
// Do not connect to the client in this file!
// const CONNECTION_STRING = process.env.DATABASE_URL || 'postgres://localhost:5432/phenomena-dev';

const { Client } = require("pg");
// const client = new Client(CONNECTION_STRING);

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "phenomena-dev",
  password: "password",
  port: 5432,
});
// client.connect();

/**
 *
 * Report Related Methods
 *
 */

/**
 * You should select all reports which are open.
 *
 * Additionally you should fetch all comments for these
 * reports, and add them to the report objects with a new field, comments.
 *
 * Lastly, remove the password field from every report before returning them all.
 */

// return openReports;

async function getOpenReports() {
  try {
    const res = await client.query(
      'SELECT * FROM reports WHERE "isOpen" = true',
      []
    );
    const openReports = res.rows;

    const res2 = await client.query("SELECT * FROM comments", []);
    const comments = res2.rows;

    openReports.forEach((report) => {
      let comment = comments.filter(
        (comment) => comment.reportId === report.id
      );
      report.comments = comment;
    });

    openReports.forEach((report) => {
      report.isExpired = Date.parse(report.expirationDate) < Date.now();
      delete report.password;
    });

    return openReports;
  } catch (error) {
    // throw error;
    return null;
  }
}

// then load the comments only for those reports, using a
// WHERE "reportId" IN () clause

// then, build two new properties on each report:
// .comments for the comments which go with it
//    it should be an array, even if there are none
// .isExpired if the expiration date is before now
//    you can use Date.parse(report.expirationDate) < new Date()
// also, remove the password from all reports

// finally, return the reports

/**
 * You should use the reportFields parameter (which is
 * an object with properties: title, location, description, password)
 * to insert a new row into the reports table.
 *
 * On success, you should return the new report object,
 * and on failure you should throw the error up the stack.
 *
 * Make sure to remove the password from the report object
 * before returning it.
 *
 */

async function createReport(reportFields) {
  // Get all of the fields from the passed in object

  // insert the correct fields into the reports table
  // remember to return the new row from the query

  // remove the password from the returned row

  // return the new report
  try {
    const res = await client.query(
      "INSERT INTO reports (title, location, description, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [
        reportFields.title,
        reportFields.location,
        reportFields.description,
        reportFields.password,
      ]
    );

    let result = res.rows[0];
    delete result.password;

    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * NOTE: This function is not for use in other files, so we use an _ to
 * remind us that it is only to be used internally.
 * (for our testing purposes, though, we WILL export it)
 *
 * It is used in both closeReport and createReportComment, below.
 *
 * This function should take a reportId, select the report whose
 * id matches that report id, and return it.
 *
 * This should return the password since it will not eventually
 * be returned by the API, but instead used to make choices in other
 * functions.
 */
async function _getReport(reportId) {
  try {
    // SELECT the report with id equal to reportId
    const res = await client.query("SELECT * FROM reports WHERE id = $1", [
      reportId,
    ]);

    // return the report

    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

/**
 * You should update the report where the reportId
 * and password match, setting isOpen to false.
 *
 * If the report is updated this way, return an object
 * with a message of "Success".
 *
 * If nothing is updated this way, throw an error
 */

async function closeReport(reportId, password) {
  try {
    const res1 = await client.query("SELECT * FROM reports WHERE id = $1", [
      reportId,
    ]);
    if (res1.rows.length == 0) {
      throw new Error("Report does not exist with that id");
    }

    if (res1.rows[0].password != password) {
      throw new Error("Password incorrect for this report, please try again");
    }

    if (res1.rows[0].isOpen == false) {
      throw new Error("This report has already been closed");
    }

    const res = await client.query(
      'UPDATE reports SET password = $1, "isOpen" = $3 WHERE id = $2 RETURNING *',
      [password, reportId, false]
    );

    return { message: "Report successfully closed!" };
  } catch (error) {
    throw error;
  }
}

async function createReportComment(reportId, commentFields) {
  try {
    const res1 = await client.query("SELECT * FROM reports WHERE id = $1", [
      reportId,
    ]);
    if (res1.rows.length == 0) {
      throw new Error("That report does not exist, no comment has been made");
    }

    if (Date.parse(res1.rows[0].expirationDate) < new Date()) {
      throw new Error(
        "The discussion time on this report has expired, no comment has been made"
      );
    }

    if (res1.rows[0].isOpen == false) {
      throw new Error("That report has been closed, no comment has been made");
    }

    const res = await client.query(
      'INSERT INTO comments ("reportId", content) VALUES ($1, $2) RETURNING *',
      [reportId, commentFields.content]
    );

    return res.rows[0];

    // const report = await Report.findById(reportId);

    // if (!report) {
    //   throw new Error("Report not found");
    // }

    // if (report.status !== 'open') {
    //   throw new Error("Report is not open");
    // }

    // if (Date.parse(report.expirationDate) < new Date()) {
    //   throw new Error("Report has expired");
    // }

    // const comment = await Comment.create({
    //   reportId,
    //   ...commentFields
    // });

    // const expirationDate = new Date();
    // expirationDate.setDate(expirationDate.getDate() + 1);
    // report.expirationDate = expirationDate;
    // await report.save();

    // return comment;
  } catch (error) {
    throw error;
  }
}

// export the client and all database functions below

module.exports = {
  client,
  getOpenReports,
  createReportComment,
  createReport,
  closeReport,
  _getReport,
};
