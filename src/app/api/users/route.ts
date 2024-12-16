import { executeQuery } from "../../_lib/db";

export async function GET () {
    const data = await executeQuery("SELECt * FROM user",[]);
    return Response.json(data);
}