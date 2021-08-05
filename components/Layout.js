import Head from "next/head";
import { useRouter } from "next/router";

export default function Layout({ children }) {
    const router = useRouter();

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                {/* <title>Cangrid</title> */}
                {/* <title>DevFlow</title> */}
                <meta charset="UTF-8" />
                <meta
                    name="description"
                    content="A ReactJS (soon to be upgraded to NextJS) and Firebase project that will allow users to upload their photos to a universal gallery and share with others (the main page) and have a private gallery for their own uploads and everyone view it by a dynamic subdomain. Uploads are only processed by logging in and authenticating via Google."
                />
                <meta
                    name="keywords"
                    content="cangrid,dslr,camera,gallery,portfolio,devflow,thedevflow,HTML,CSS,JavaScript,ES6,TailwindCSS,Bootstrap,React,ReactJS,Redux,Context API, Next,NextJS,Vercel,Netlify,Firebase,Google Firebase,Sanity,SanityIO,GROQ,Deployment,Angular,Heroku,git,github,nodejs,express,expressjs,npm,yarn,php,C++,c#,mongodb,nosql,sql,mysql,api,business,apps,application,projects,ios,mobile,landing pages,website,DevFlow, aquatics, brand, programming, web developer, fishkeeping, betta, shrimps, aquariums, hardscapping, aquascaping, fitness, gym, lifting, deadlift, squats, bench"
                />
                <meta name="author" content="Jason-Kyle De Lara" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <link
                    rel="icon"
                    href="favicon/favicon.ico"
                    type="image/x-icon"
                />
                <link
                    rel="shortcut icon"
                    href="favicon/favicon.ico"
                    type="image/ico"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="favicon/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="favicon/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="favicon/favicon-16x16.png"
                />
                <link rel="manifest" href="/site.webmanifest"></link>
            </Head>
            <main>{children}</main>
        </>
    );
}
