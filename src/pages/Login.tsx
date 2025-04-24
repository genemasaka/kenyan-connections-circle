
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

const Login = () => {
  const [showResetForm, setShowResetForm] = useState(false);

  return (
    <Layout>
      <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                {showResetForm ? "Reset Password" : "Sign in to your account"}
              </CardTitle>
              <CardDescription className="text-center">
                {showResetForm 
                  ? "Enter your email to receive a password reset link"
                  : "Enter your email and password to access your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showResetForm ? (
                <ResetPasswordForm onBack={() => setShowResetForm(false)} />
              ) : (
                <LoginForm onForgotPassword={() => setShowResetForm(true)} />
              )}
            </CardContent>
            {!showResetForm && (
              <CardFooter className="flex flex-col">
                <div className="text-center text-sm mt-2">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
                <div className="mt-4 text-center text-xs text-gray-500">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
