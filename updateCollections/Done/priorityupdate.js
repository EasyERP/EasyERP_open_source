var priorities = [{_id : 'Trivial', type : 'Leads', priority : 'Trivial'}, {_id : 'Low', type : 'Leads', priority : 'Low'}, {_id : 'Medium', type : 'Leads', priority : 'Medium'}, {_id : 'High', type : 'Leads', priority : 'High'}]

db.getCollection('Priority').update({}, {$set : {type : 'Tasks'}}, {multi : true});

