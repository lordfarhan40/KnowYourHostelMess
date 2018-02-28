const connection=require('./mysql_connection.js');

const TableStructure=`
CREATE TABLE IF NOT EXISTS HOSTELS(
    hid int NOT NULL AUTO_INCREMENT,
    name char(100) NOT NULL,
    description TEXT,
    pde int default 0,
    PRIMARY KEY(hid)
)
`;

const createHostel=(hostelDetails,callback)=>
{
    if(hostelDetails===undefined||hostelDetails.name===undefined)
    {
        callback("invalid parameters!");
        return;
    }

    var pdeField="pde";
    var pdeValue=hostelDetails.pde===undefined?0:hostelDetails.pde;
    
    var descriptionField="description";
    var descriptionValue=`\"${hostelDetails.pde}\"`;

    const createHostelQuery=`
        INSERT INTO HOSTELS(name, ${pdeField}, ${descriptionField}) 
        VALUES(\"${hostelDetails}\", ${pdeValue},${descriptionValue} );
    `;
    connection.query(createHostelQuery,callback);
};

const getHostelsList=(callback)=>
{
    const createHostelQuery=`
        SELECT hid,name FROM HOSTELS
    `;
    connection.query(createHostelQuery,callback);
};

const getHostelById=(id,callback)=>
{
    const getHostelByIdQuery=`
        SELECT hid,name,pde FROM HOSTELS WHERE hid=${id};
    `;
    connection.query(getHostelByIdQuery,(err,res)=>
    {
        console.log(err,res);
        callback(err,res[0]);
    });
};

module.exports={
    createHostel,
    getHostelsList,
    getHostelById
}