const sql = require('mssql');
const ExcelJS = require('exceljs');
const dbConfig = require('../database/dbConfig');

async function getClientes() {
    try {
      await sql.connect(dbConfig);
  
      let query = " SELECT * FROM V_PORTAL_CLIENTES";
      const result = await sql.query(query);
  
      return result.recordset;
    } catch (error) {
      throw error;
    } finally {
      sql.close();
    }
  }

module.exports = {
  getClientes
};
