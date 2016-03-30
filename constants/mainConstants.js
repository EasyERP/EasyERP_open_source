/**
 * Created by Roman on 13.07.2015.
 */
module.exports = {
    HR_DEPARTMENT_ID       : '55b79342b370f8642a0013b5',
    BUSINESS_DEPARTMENT_ID : '55b79342b370f8642a0013b4',
    MARKETING_DEPARTMENT_ID: '55b79342b370f8642a0013b3',

    PAYONEER    : '555cc981532aebbc4a8baf36',
    UKR_SIB_BANK: '555cc981532aebbc4a8baf37',
    PRIMARY     : '555cc981532aebbc4a8baf38',

    WTRACK_DB_NAME: 'weTrack',

    PRODUCRSERVICE: "5540d528dacb551c24000003",

    EXPENSESCAREGORY: "56459202624e48551dfe3b24",

    ORDERNEW         : "55647b932e4aa3804a765ec5",
    ORDERDONE        : "55647b962e4aa3804a765ec6",
    PROJECTINPROGRESS: "528ce7f2f3f67bc40b000023",
    JOBSFINISHED     : "56337c675d49d8d6537832ea",
    JOBSINPROGRESS   : "56337c705d49d8d6537832eb",
    PROJECTCLOSED    : "528ce82df3f67bc40b000025",

    CURRENCY_USD: '565eab29aeb95fa9c0f9df2d',
    OVERHEAD    : '56cc734b541812c071973572',

    OVERTIME_PAYABLE: '56cc7383541812c071973574',
    IDLE_PAYABLE    : '56cc72c4541812c071973570',
    VACATION_PAYABLE: '56cc72a8541812c07197356e',
    SALARY_PAYABLE  : '56cc727e541812c07197356c',

    SALARY_NOTDEV: '56cc727e541812c07197356c',

    JOB_FINISHED        : '56337c675d49d8d6537832ea',
    FINISHED_JOB_JOURNAL: '56ebb636b2a906141f194fa5',

    CLOSED_JOB: '56f2a96f58dfeeac4be1582a',

    PRODUCT_SALES: '565eb53a6aa50532e5df0be0',
    COGS         : '565eb53a6aa50532e5df0be2',

    ACCOUNT_RECEIVABLE: '565eb53a6aa50532e5df0bc9',

    INVOICE_JOURNAL: '565ef6ba270f53d02ee71d65',

    ADMIN_SALARY_JOURNAL: '56f3fac93fb451104c75a477',

    VACATION_EXPENSES: '56c9d4c7c3b88f6d64490fb4',

    IDLE_EXPENSES: '56cc6b62541812c071973569',

    ADMIN_SALARY_EXPENSES: '565eb53a6aa50532e5df0bed',

    INCOME_SUMMARY_ACCOUNT: '56f538149c85020807b4001f',

    BANK_AND_CASH: [
        '565eb53a6aa50532e5df0bd6', //bank and Cash
        '565eb53a6aa50532e5df0bd3',
        '565eb53a6aa50532e5df0bd2',
        '565eb53a6aa50532e5df0bd1',
        '565eb53a6aa50532e5df0bd0',
        '565eb53a6aa50532e5df0bcf',
        '565eb53a6aa50532e5df0bce',
        '565eb53a6aa50532e5df0bcd',
        '565eb53a6aa50532e5df0bcc',
        '565eb53a6aa50532e5df0bcb',
        '565eb53a6aa50532e5df0bca'
    ],

    FINISHED_GOODS : '565eb53a6aa50532e5df0bd9',
    WORK_IN_PROCESS: '565eb53a6aa50532e5df0bda',

    LIABILITIES: [
        '565eb53a6aa50532e5df0bde', //Reserve and Profit/Loss Account
        '565eb53a6aa50532e5df0bdd', //tax received
        '565eb53a6aa50532e5df0bdb',//current Liabilities
        '56c4444eb81fd51e19207f3e', //salary Payable
        '56c9d555c3b88f6d64490fb5',//overtime Payable
        '565eb53a6aa50532e5df0bdc'
    ],

    ACCOUNT_PAYABLE: '565eb53a6aa50532e5df0bdc',

    EQUITY: [
        '565eb53a6aa50532e5df0bf3' //retained Earnings
        //'565eb53a6aa50532e5df0bf2', //capital
       // '565eb53a6aa50532e5df0be0', //productSales
        //'565eb53a6aa50532e5df0be2'//COGS
    ],

    SALARY_PAYABLE_ACCOUNT : '56c4444eb81fd51e19207f3e',
    SALARY_OVERTIME_ACCOUNT: '56c9d555c3b88f6d64490fb5',

    PAYMENT_JOURNAL: '56f243d9574610102546a33a',

    SALARY_PAYMENT_JOURNAL: '56f28cb517d856740da4c8d7',

    OPERATING: [],
    INVESTING: [],
    FINANCING: [],

    MOBILE_DEFAULT_COUNT_PER_LIST: 50,

    DASH_VAC_WEEK_BEFORE: 2,
    DASH_VAC_WEEK_AFTER : 8,

    HR_VAC_YEAR_BEFORE: 2,
    HR_VAC_YEAR_AFTER : 1,

    NOT_DEV_ARRAY: [ //HR, Marketing, Business, Finance
        "560c0b83a5d4a2e20ba5068c",
        "55b92ace21e4b7c40f000013",
        "55b92ace21e4b7c40f000014",
        "55b92ace21e4b7c40f000015",
        '55bb1f40cb76ca630b000007' //PM
    ],

    CREDIT_IS: '56f5383a9c85020807b40020',
    CLOSE_COGS: '56f538679c85020807b40022',
    RETAINED_EARNINGS: '56f538c39c85020807b40024',
    CLOSE_VAC_EXP: '56efc13cfd70ba6414bd3de7',
    CLOSE_IDLE_EXP: '56efc15bfd70ba6414bd3de9',
    CLOSE_ADMIN_EXP: '56efc1affd70ba6414bd3deb',
    CLOSE_ADMIN_BUD: '56f90e8d8cea58642c57f442',

    TOTAL_EXPENSES: '56cc6bf2541812c07197356a',

    CLOSE_MONTH_JOURNALS: [
        '56f5383a9c85020807b40020', //credit Income Summary
        '56f538679c85020807b40022', //close COGS
        '56f538c39c85020807b40024', //retained earnings
        '56efc13cfd70ba6414bd3de7', //close Vacation Expenses
        '56efc15bfd70ba6414bd3de9', //close idle Expenses
        '56efc1affd70ba6414bd3deb', //close admin salary expenses
        '56f90e8d8cea58642c57f442'
    ]
}
;