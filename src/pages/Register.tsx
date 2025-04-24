
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, UserPlus } from "lucide-react";

const Register = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [profession, setProfession] = useState("");
  const [interests, setInterests] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setRegisterLoading(true);

    // Basic validation
    if (!name || !email || !age || !profession || !interests || !lookingFor || !password) {
      setFormError("Please fill in all fields");
      setRegisterLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      setRegisterLoading(false);
      return;
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      setFormError("Please enter a valid age (18-100)");
      setRegisterLoading(false);
      return;
    }

    const interestArray = interests.split(",").map(interest => interest.trim());
    if (interestArray.length < 1) {
      setFormError("Please enter at least one interest");
      setRegisterLoading(false);
      return;
    }

    const userData = {
      name,
      email,
      age: ageNum,
      profession,
      interests: interestArray,
      lookingFor,
      profilePrivacy: {
        showPhoto: true,
        showProfession: true,
      },
    };

    try {
      const success = await register(userData, password);
      if (success) {
        navigate("/login");
      } else {
        // If registration was not successful
        setRegisterLoading(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Layout>
      <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Create your account
              </CardTitle>
              <CardDescription className="text-center">
                Fill in your details to join our community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="30"
                      min="18"
                      max="100"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      type="text"
                      placeholder="Software Engineer"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">
                    Interests (comma-separated)
                  </Label>
                  <Input
                    id="interests"
                    type="text"
                    placeholder="tech, hiking, reading, travel"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Enter your interests separated by commas. These will be used for matching.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lookingFor">What are you looking for?</Label>
                  <Textarea
                    id="lookingFor"
                    placeholder="I'm looking to connect with other professionals in my field..."
                    value={lookingFor}
                    onChange={(e) => setLookingFor(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {formError && (
                  <div className="text-destructive text-sm">{formError}</div>
                )}

                <Button type="submit" className="w-full" disabled={registerLoading}>
                  {registerLoading ? (
                    "Creating account..."
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-center text-sm mt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
              <div className="mt-4 text-center text-xs text-gray-500">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
