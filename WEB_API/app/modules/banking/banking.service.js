const database = require("../../models");
const BankingClass = require("../banking/banking.class");
const PROCEDURE_NAME = require("../../common/const/procedureName.const");
const userService = require("../user/user.service");

const createTransaction = async (model) => {
  console.log(model)
  let data = {
    BANKID: model.bankid,
    SIGNATURE: model.signature,
    FROMACCOUNTNUMBER: model.from_account_number,
    FROMACCOUNTNAME: model.from_account_name,
    TOACCOUNTNUMBER: model.to_account_number,
    TOACCOUNTNAME: model.to_account_name,
    AMOUNT: model.amount,
    CHARGECODE: model.charge_code,
    CHARGEAMOUNT: model.charge_amount,
    CONTENT: model.content,
  };

  let query = `${PROCEDURE_NAME.BANK_BANKLINKING_TRANFER_CREATE} 
        @BANKID=:BANKID,
        @SIGNATURE=:SIGNATURE,
        @FROMACCOUNTNUMBER=:FROMACCOUNTNUMBER,
        @FROMACCOUNTNAME=:FROMACCOUNTNAME,
        @TOACCOUNTNUMBER=:TOACCOUNTNUMBER,
        @TOACCOUNTNAME=:TOACCOUNTNAME,
        @AMOUNT=:AMOUNT,
        @CHARGECODE=:CHARGECODE,
        @CHARGEAMOUNT=:CHARGEAMOUNT,
        @CONTENT=:CONTENT`;
  const bankDetail = await userService.detailBankConnect(model.bankid);
  if (bankDetail == null) {
    return null;
  }
  let transaction;
  try {
    // get transaction
    transaction = await database.sequelize.transaction();
console.log(query)
console.log(data);
    const result = await database.sequelize.query(query, {
      replacements: data,
      type: database.QueryTypes.INSERT,
      transaction: transaction,
    });
    if (!result) {
      if (transaction) {
        await transaction.rollback();
      }
      return null;
    }
    // commit
    await transaction.commit();
    return result[0][0];
  } catch (err) {
    console.log("err.message", err.message);
    // Rollback transaction only if the transaction object is defined
    if (transaction) {
      await transaction.rollback();
    }
    return null;
  }
};

module.exports = {
  createTransaction,
};
