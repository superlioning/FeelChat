"use client";

import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="container py-5">
      <div className="row align-items-center g-5 py-5">
        <div className="col-lg-6">
          <Image
            src="/OnlineChat.jpg"
            className="d-block mx-lg-auto img-fluid"
            alt="FeelChat"
            width={700}
            height={500}
            loading="lazy"
          />
        </div>
        <div className="col-lg-6 text-center text-lg-start">
          <h1 className="display-4 fw-bold lh-1 mb-3">FeelChat</h1>
          <p className="lead mb-4">
            A real-time web-based chat application that integrates sentiment analysis to enhance communication by providing instant emotional insights during conversations.
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="btn btn-primary btn-lg px-4 me-md-2"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="btn btn-outline-secondary btn-lg px-4"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}