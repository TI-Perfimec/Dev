const sql = require('mssql');
const ExcelJS = require('exceljs');
const dbConfig = require('../database/dbConfig');

async function getPedidosEmCarteira() {
  try {
    await sql.connect(dbConfig);

    let query = ' SELECT * '
    query += ' FROM V_PORTAL_PEDIDOS_EM_CARTEIRA ';
    const result = await sql.query(query);

    return result.recordset;
  } catch (error) {
    throw error;
  } finally {
    sql.close();
  }
}

async function getPedidosEmCarteiraPCP() {
  try {
    await sql.connect(dbConfig);

    let query = " SELECT * "
    query += " FROM V_PORTAL_PEDIDOS_EM_CARTEIRA_PCP WHERE 1=1 ORDER BY [Dt Ent PCP]";
    const result = await sql.query(query);

    return result.recordset;
  } catch (error) {
    throw error;
  } finally {
    sql.close();
  }
}

module.exports = {
  getPedidosEmCarteira,
  getPedidosEmCarteiraPCP
};
