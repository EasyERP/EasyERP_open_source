/**
 * Created by den on 19.05.16.
 */
db.getCollection('Invoice').update({_type: 'Proforma', invoiced: true, payments: {$ne: 0}},
    {$set: {workflow: ObjectId('573db03b782445233dbe6835')}},
    { multi: true })

// ObjectId('573db03b782445233dbe6835') - id for Cancelled workflow form production DB