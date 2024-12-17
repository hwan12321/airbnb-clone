import { NextRequest, NextResponse } from "next/server"

const GET = (req:NextRequest, res:NextResponse) => {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    
}