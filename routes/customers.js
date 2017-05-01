"use strict";

// UUID
var uuid = require('uuid');

// Dates
var dateutil = require('dateutil');

//Password functions
var password = require('password-hash-and-salt');

//-------------------------------------------------------------------------------------------
//
// CRUD for Customers
//
//-------------------------------------------------------------------------------------------
// Version
exports.readCustomerVersion = function(req, res) {
	res.status(200).json({result: 'success', data:{ version : "1.0" }});		
}; // End exports.readCustomerVersion
// Create
exports.createCustomer = function(req, res) {
	// get a pg client from the connection pool
	pool.connect(function(err, client, done) {
    	var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			done();
			res.status(500).json({ result:'error', data:{ error:err } });
			return true;
    	}; // End handleError
    	// handle an error from the connect
		if(handleError(err)) return;
		if(req.body.data) {
			// Validate
			if(req.body.data.email && req.body.data.password) {
                var first_name = req.body.data.first_name ? req.body.data.first_name : "";
                var last_name = req.body.data.last_name ? req.body.data.last_name : "";
				// Does this username / email already exist?
                emailExists(req.body.data.email, function(err, result) {	
                    if(err) {
                        done();
                        res.status(500).json({ result:'error', data:{ error:err } });
                    } /* End If(err) loop */ else {
                        // No error from the call, so check result of if it exists
                        if(result == true) {
                            done();
                            res.status(400).json({ result:'error', data:{ error:'user account already exists' } });
                        } /* End if(result) loop */ else {
                            // Email doesn't already exist, so create account
                            //password function
                            password(req.body.data.password).hash(function(err, hash) {
                                if(handleError(err)) return;
                                //Otherwise- Save				
                                var queryText = 'INSERT INTO customers (id, first_name, last_name, email, password, date_created, date_updated) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id'
                                client.query(queryText, [uuid.v4(), first_name, last_name, req.body.data.email, hash, dateutil.date(), dateutil.date()], function(err, result) {
                                    // handle an error from the query
                                    if(handleError(err)) return;	
                                    done();
                                    res.status(200).json({result: 'success', data:{id : result.rows[0].id}});
                                }); // End client.query 
                            }); // End password hash
                        } // End else loop
                    } // End else loop
			    }); // End username / email validate
	    	} /* End If validate loop */ else {
		    	done();
		    	res.status(400).json({ result:'error', data:{ error:'email and password are required' } });
	    	} // End else loop
    	} /* End if(req.body.data)*/ else {
	    	done();
	    	res.status(400).json({ result:'error', data:{ error:'Missing data object' } });
    	} // End else loop
  	}); // End pool.connect
}; // End exports.createCustomer

//---------------------------------------------------------------------------------------
// Read a specific customer
//
exports.readCustomer = function(req, res) {
	// get a pg client from the connection pool
	pool.connect(function(err, client, done) {
    	var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			done();
			res.status(500).json({ result:'error', data:{ error:err } });
			return true;
    	}; // End handleError
    	// handle an error from the connect
		if(handleError(err)) return;
		if(req.params.id) {
			// Setup the query		
			var query = 'SELECT id, first_name, last_name, email FROM customers WHERE id = $1';
			client.query(query, [req.params.id], function (err, result) {
				// handle an error from the query
				if(handleError(err)) return;
				done();
				res.status(200).json({result: 'success', data:{ customer : result.rows }});
			}); // End client.query	      	
    	} /* End if(req.params.id) loop */ else {
	    	done();
	    	res.status(400).json({ result:'error', data:{ error:'id is required' } });
    	} // End else loop
	}); // End pool.connect
}; // End exports.readCustomer

//---------------------------------------------------------------------------------------
// Update a specific customer
//
exports.updateCustomer = function(req, res) {
	
	// get a pg client from the connection pool
	pool.connect(function(err, client, done) {

    	var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			done();
			res.status(500).json({ result:'error', data:{ error:err } });
			return true;
    	}; // End handleError
    	
    	// handle an error from the connect
		if(handleError(err)) return;

			// Validate then insert
			if(req.body.data) {
			
				if(req.body.data.id_customer) {	
					
					var queryText = 'UPDATE customers SET date_updated = $2';			
					var argumentCount = 2;
					var valueArray = [req.body.data.id_customer, dateutil.date()];
										
					if(req.body.data.first_name) {
						argumentCount = argumentCount + 1;
						queryText = queryText + ', first_name = $' + argumentCount; 
						valueArray.push(req.body.data.first_name);
					} // End if first_name loop
					if(req.body.data.last_name) {
						argumentCount = argumentCount + 1;
						queryText = queryText + ', last_name = $' + argumentCount; 
						valueArray.push(req.body.data.last_name);
					} // End if last_name loop
					if(req.body.data.email) {
						argumentCount = argumentCount + 1;
						queryText = queryText + ', email = $' + argumentCount; 
						valueArray.push(req.body.data.email);
					} // End if email loop

					queryText = queryText + ' WHERE id = $1 RETURNING id;';
		
					client.query(queryText, valueArray, function(err, result) {
		    			// handle an error from the query
						if(handleError(err)) return;
						done();
						if(result.rowCount > 0) {
							res.status(200).json({result: 'success', data:{ id : result.rows[0].id }});
						} /* End if rowCount loop */ else {
							res.status(400).json({ error: 'id not found' });	
						} // End else loop
	      		}); // End client.query
      		
      		} /* End if req id_customer loop */ else {
	      		done();
	      		res.status(400).json({ result:'error', data:{ error:'a minimum of id_user is required inside the data object'} });
    		} // End else loop
      	
    	} /* End if validate loop */ else {
	    	done();
	    	res.status(400).json({ result:'error', data:{ error:'Missing data object' } });
    	} // End else loop
  	}); // End pool.connect
}; // End export.updateCustomers


//---------------------------------------------------------------------------------------
// Delete
exports.deleteCustomer = function(req, res) {
	
	// get a pg client from the connection pool
	pool.connect(function(err, client, done) {

    	var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			done();
			res.status(500).json({ result:'error', data:{ error:err } });
			return true;
    	}; // End handleError
    	
    	// handle an error from the connect
		if(handleError(err)) return;

		// Validate then insert
		if(req.params.id) {
			
			var queryText = 'DELETE FROM customers WHERE id = $1'
			client.query(queryText, [req.params.id], function(err, result) {
    			// handle an error from the query
				if(handleError(err)) return;
				done();	
				res.status(200).json({result: 'success', data:{count : result.rowCount}});
      		}); // End client.query
      	
    	} /* End if validate loop */ else {
	    	done();
	    	res.status(400).json({ result:'error', data:{ error:'id is required' } });
    	} // End else loop
   
  	}); // End pool.connect
}; // End exports.deleteCustomer


//---------------------------------------------------------------------------------------
// Login
exports.loginCustomer = function(req, res) {
	
	// get a pg client from the connection pool
	pool.connect(function(err, client, done) {

    	var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			done();
			res.status(500).json({ result:'error', data:{ error:err } });
			return true;
    	}; // End handleError
    	
    	// handle an error from the connect
		if(handleError(err)) return;
		
		// Validate then insert
		if(req.body.email && req.body.password) {

			var queryText = 'SELECT id, first_name, last_name, email, password FROM customers WHERE email ilike $1;'
			client.query(queryText, [req.body.email], function(err, result) {
				// handle an error from the query
				if(handleError(err)) return;
				done();
				var customer = [];
				if(result.rowCount > 0)	{
                    // Test password by passing it to the password - hash - salt function
					password(req.body.password).verifyAgainst(result.rows[0].password, function(err, verified) {
						if(handleError(err)) return;
						if(!verified) {
                            res.status(403).json({ result:'success', data:{ customer: customer } });
        				} /* End if verified */ else {
							customer.push({id: result.rows[0].id});
							customer.push({first_name: result.rows[0].first_name});
							customer.push({last_name: result.rows[0].last_name});
							customer.push({email: result.rows[0].email});
	        				res.status(200).json({ result:'success', data:{ customer: customer } });
                        } // End else loop
        			}); // End password test
                } /* End if rowCount */ else {
					res.status(403).json({ result:'success', data:{ customer: customer } });
				} // End else loop
            }); // End client.query
      		
    	} /* End if Validate loop */ else {
	    	done();
	    	res.status(400).json({ result:'error', data:{ error:'email and password are required' } });
    	} // End else loop
   
  	}); // End pool.connect
}; // End exports.loginCustomer


//---------------------------------------------------------------------------------------------
//
// Functions for Customers
//
function emailExists(emailValue, callback) {
		
	// get a pg client from the connection pool
	pool.connect(function(err, client, done) {
    	
		var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			done();
			callback({error:'Database Error'},false);
    	}; // End handleError
    	
    	// handle an error from the connect
		if(handleError(err)) return;
		
		if(emailValue) {
			var queryText = 'SELECT email FROM customers WHERE email = $1'
			client.query(queryText, [emailValue], function(err, result) {
				if(handleError(err)) return;
                done();

                if(result.rowCount > 0) {
                    callback(null,true);	
                } /* End if rowCount */ else {
                    callback(null,false);
                } // End else loop		
      		}); // End client.query
      	
    	} /* End if emailValue */ else {
	    	done();
	    	callback({error:'email is required'},false);
    	} // End else loop
   
  	}); // End pool.connect
}; // End function emailExists

