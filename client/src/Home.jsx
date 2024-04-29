import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import '../app/globals.css'


const Home = () => {
  const navigation = useNavigate();

  return (
    <div className="bg-background text-white mx-2">
      <div className="">
        <div className="flex gap-8 py-20 lg:py-40 items-center 
          justify-center flex-col text-text-primary">
          <div>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              Relaxation never felt so good.
            </h1>
            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              We are a locally-owned Utah company dedicated to creating
              hand made custom furniture that you can't find anywhere else.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" 
              className="gap-4 hover:bg-highlight" variant="outline"
              onClick={() => navigation('/store')} 
              >Shop Now
            </Button>
            <Button size="lg" 
              className="gap-4 hover:bg-highlight"
              onClick={() => navigation('/contact')}  
              >Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

