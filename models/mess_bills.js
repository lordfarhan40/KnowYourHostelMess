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

    const createMessBillQuery=`INSERT INTO MESSBILLS(uid,hid,date,file,price) VALUES(
        \"${messBill.uid}\",
        ${messBill.hid},
        \"${messBill.date}\",
        \"${messBill.file}\",
        ${messBill.price}
    )`;

    connection.query(createMessBillQuery,callback);
};

const getBillsByHid=(hid,callback)=>
{
    if(hid===undefined)
        return callback("HID not defined.");
    const getBillsByHidQuery=`
        SELECT * FROM MESSBILLS WHERE hid=${hid};
    `;
    connection.query(getBillsByHidQuery,callback);
};



module.exports={
    createMessBill,
    getBillsByHid
}