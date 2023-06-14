import { NextResponse } from 'next/server'

export function middleware(req) {
    const url = req.nextUrl.clone()
    if (url.pathname === '/') {
        url.pathname = '/manage'
        return NextResponse.redirect(url)
    }
}