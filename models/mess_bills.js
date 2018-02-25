const connection=require('./mysql_connection.js');

const TableStructure=`
CREATE TABLE IF NOT EXISTS MESSBILLS(
    hid INT NOT NULL,
    date DATE NOT NULL,
    file char(100) NOT NULL,
    price int NOT NULL,
    uid char(10) NOT NULL,
    PRIMARY KEY(hid,date)
)
`;

const createMessBill=(messBill,callback)=>
{
    if(messBill===undefined||messBill.hid===undefined||messBill.date===undefined)
    {
        callback("Error: Need more details to add bill");
        return;
    }

    const createMessBillQuery=`
        INSERT INTO MESSBILLS VALUES(hid,date,file,price,uid)
        VALUES(
            ${messBill.hid},
            \"${messBill.date}\",
            \"${file}\",
            ${price},
            \"${uid}\"
        )
    `;

    connection.query(createMessBillQuery,callback);
};



module.exports={
    createMessBill
}