"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/components/isomorphic/userContext";
import ProfileDetail from "@/components/account/profileDetail";
import EditProfile from "@/components/account/editProfile";
import FacilityReviews from "@/components/facilities/facilityReviews";
import LoadingPage from "@/components/loadingPage";
import ProtectedRoute from "@/components/protectedRoute";

interface Review {
  id: string;
  user: string;
  user_name: string;
  user_pfp: string;
  user_start: string;
  booking: string;
  facility: string;
  facility_name: string;
  rating: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function Page() {
  const { user, fetchWithCredentials } = useUser();
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const startEditing = () => {
    setEditProfile(true);
  };

  const stopEditing = () => {
    setEditProfile(false);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      if (user) {
        try {
          const response = await fetchWithCredentials(
            `${process.env.NEXT_PUBLIC_API_URL}/facilities/reviews/?user=${user.id}`,
          );
          if (response.ok) {
            const data = await response.json();
            setReviews(data);
          } else {
            throw new Error("Failed to fetch reviews");
          }
        } catch (error) {
          setError("Failed to fetch reviews");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchReviews();
  }, [user, fetchWithCredentials]);

  if (loading) {
    return (
      <ProtectedRoute>
        <LoadingPage />;
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div>Error: {error}</div>;
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-full w-full flex-col items-center">
        <h1 className="text-center text-[40px] font-semibold">Profil</h1>
        {!editProfile ? (
          <div className="flex w-full flex-col items-center justify-center space-y-10">
            <div className="flex w-3/5 flex-col items-center justify-center space-y-10">
              <ProfileDetail onEditProfile={startEditing} />
              <div className="h-[1px] w-full bg-[#E0E5F2]"></div>
            </div>
            <FacilityReviews reviews={reviews} editable={true} />
          </div>
        ) : (
          <EditProfile onCancel={stopEditing} />
        )}
      </div>
    </ProtectedRoute>
  );
}
