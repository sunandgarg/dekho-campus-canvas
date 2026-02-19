import { Star, CheckCircle, ThumbsUp, ThumbsDown, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface StudentReview {
  id: string;
  reviewer_name: string;
  course: string;
  batch_year: number;
  rating: number;
  title: string;
  content: string;
  pros: string;
  cons: string;
  is_verified: boolean;
  created_at: string;
}

export function StudentReviews({ collegeSlug }: { collegeSlug: string }) {
  const { data: reviews } = useQuery({
    queryKey: ["student-reviews", collegeSlug],
    queryFn: async () => {
      const { data } = await supabase
        .from("student_reviews")
        .select("*")
        .eq("college_slug", collegeSlug)
        .eq("is_active", true)
        .order("display_order");
      return (data ?? []) as StudentReview[];
    },
  });

  if (!reviews || reviews.length === 0) return null;

  const avgRating = reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-4 mb-2">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{avgRating.toFixed(1)}</p>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? "text-golden fill-golden" : "text-muted-foreground"}`} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{reviews.length} reviews</p>
        </div>
      </div>

      {/* Individual Reviews */}
      {reviews.map((review) => (
        <div key={review.id} className="bg-muted/50 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  {review.reviewer_name}
                  {review.is_verified && <CheckCircle className="w-3.5 h-3.5 text-success" />}
                </p>
                <p className="text-xs text-muted-foreground">{review.course} • Batch {review.batch_year}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-golden fill-golden" />
              <span className="text-sm font-bold text-foreground">{review.rating}</span>
            </div>
          </div>
          <p className="text-sm font-medium text-foreground">{review.title}</p>
          <p className="text-sm text-muted-foreground">{review.content}</p>
          {(review.pros || review.cons) && (
            <div className="grid sm:grid-cols-2 gap-2 mt-2">
              {review.pros && (
                <div className="flex items-start gap-1.5">
                  <ThumbsUp className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">{review.pros}</p>
                </div>
              )}
              {review.cons && (
                <div className="flex items-start gap-1.5">
                  <ThumbsDown className="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">{review.cons}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
