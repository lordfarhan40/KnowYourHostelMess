const connection=require('./mysql_connection.js');

const TableStructure=`
    CREATE TABLE IF NOT EXISTS USERS(
        uid char(10) NOT NULL,
        password char(40) NOT NULL,
        isAdmin int NOT NULL,
        contact char(15),
        hostel_id int NOT NULL,
        name char(100) NOT NULL,
        PRIMARY KEY (uid)
    )
`;

const createUser=(userDetails,callback)=>
{
    if(userDetails===undefined||userDetails.id===undefined||userDetails.password===undefined||userDetails.hostel_id===undefined||userDetails.name===undefined)
    {
        callback("Error: Full details not provided");
        return;
    }
    const createUserQuery=`
    INSERT INTO USERS(uid,password,hostel_id,name) values(\
        "${userDetails.id}\",
        \"${userDetails.password}\",
        ${userDetails.hostel_id},
        \"${userDetails.name}\"
    )`;
    connection.query(createUserQuery,callback);
};

const getUserById=(id,callback)=>
{
    if(id===undefined)
    {
        callback("Error: No Id provided")
        return;
    }
    const getUserByIdQuery=`SELECT * FROM USERS WHERE uid=\"${id}\"`;
    connection.query(getUserByIdQuery,(err,result)=>
    {
        if(err)
        {
            callback(err);
            return;
        }
        result=result[0];
        userDetails={
            id:result.uid,
            password:result.password,
            isAdmin:result.isAdmin,
            contact:result.contact,
            hostel_id:result.hostel_id,
            name:result.name
        }
        callback(err,userDetails);        
    });
};

const changePassword=(id,newPassword,callback)=>
{
    if(id===undefined||newPassword===undefined)
    {
        callback("Provide an ID and Password");
        return;
    }
    const changePasswordQuery=`
        UPDATE USERS
        SET password=\"${newPassword}\"
        WHERE uid=\"${id}\"
    `;
    connection.query(changePasswordQuery,callback);
};

module.exports={
    createUser,
    getUserById,
    changePassword
}