const mysql = require('mysql');

module.exports = {

	createPool: function(obj) {
		return mysql.createPool(obj);
	},
	//构架数据库连接池

	sever: function(pool, sqlString) {
		return new Promise((resolve, reject) => {
			console.log(sqlString);
			pool.getConnection(function(err, connection) {
				if (err) {
					console.log(err);
					reject(err);
				} else {
					connection.query(sqlString, function(err, rows) {
						if (err) {
							console.log(err);
							reject(err);
						} else {
							resolve(rows);
						}
						connection.release();
						//异步释放连接
					});
				}
			});
		})
	},
	//基础数据库操作

	handler: function(pool) {
		return new Promise((resolve, reject) => {
			pool.getConnection(function(err, connection) {
				if (err) {
					console.log(err);
					reject(err);
					//创建连接失败
				} else {
					connection.beginTransaction(err => {
						if (err) {
							console.log(err);
							reject(err);
							//创建事务失败
						} else {
							resolve(connection);
						}
					})
				}
			})
		});
	},
	//封装事务操作

	stepsql: function(connect, sqlString) {
		return new Promise(function(resolve, reject) {
			console.log(sqlString);
			connect.query(sqlString, function(err, message) {
				if (err) {
					reject(err);
				} else {
					resolve(message);
				}
			});
		})
	},
	//封装事务语句

	escape: mysql.escape,

	select: function(type, table, where) {
		if (where) {
			return "SELECT " + type.join(",") + " FROM " + table + " WHERE " + where;
		} else {
			return "SELECT " + type.join(",") + " FROM " + table;
		}

	},
	//查询语句拼接

	insert: function(table, type, value, ignore) {

		if (ignore == true) {
			return "INSERT IGNORE INTO " + table + " (" + type.join(",") + ") VALUES (" + value.join(",") + ")";
		}
		return "INSERT INTO " + table + " (" + type.join(",") + ") VALUES (" + value.join(",") + ")";

	},
	//插入语句拼接

	update: function(table, type, value, where) {

		for (var i = 0; i < value.length; i++) {
			type[i] = type[i] + "=" + value[i];
		}
		if (where) {
			return "UPDATE " + table + " SET " + type.join(",") + " WHERE " + where;
		} else {
			return "UPDATE " + table + " SET " + type.join(",");
		}

	},
	//更新语句拼接


	del: function(table, where) {
		if (where) {
			return "DELETE FROM  " + table + " WHERE " + where;
		} else {
			return "DELETE FROM  " + table;
		}
	},
	//删除语句拼接
	
	strToHexCharCode:function strToHexCharCode(str) {
	　　 var res = [];  
	    for ( var i=0; i<str.length; i++ ) {  
	    res[i] = ( "00" + str.charCodeAt(i).toString(16) ).slice(-4);  
	    }  
	    return "\\u" + res.join("\\u");  
	},
	
	
	hexCharCodeToStr:function hexCharCodeToStr(str) {
	　　    str = str.replace(/\\/g, "%");  
	    return unescape(str);  
	}
}
