import Hero from "@/components/Hero";
import { CategoryStrip } from "@/components/CategoryItem";
import FeaturedProducts from "@/components/FeaturedProducts";
import { FlashSaleSection } from "@/components/FlashSale";
import { TrustStrip } from "@/components/Trust&GuaranteeStrip";
import { TestimonialsSection } from "@/components/Testimonials";
import { NewsletterSection } from "@/components/Newsletter";

export default function Home() {
  return (
    <main className="flex flex-col bg-gray-50/40">
      {/* ১. Hero */}
      <Hero />

      {/* ২. Trust & Guarantee strip */}
      <TrustStrip />

      {/* ৩. Shop by Category */}
      <CategoryStrip />

      {/* ৪. Featured Products — real data from server */}
      <FeaturedProducts />

      {/* ৫. Flash Sale — static demo deals */}
      <FlashSaleSection />

      {/* ৬. Customer Reviews */}
      <TestimonialsSection />

      {/* ৭. Newsletter */}
      <NewsletterSection />
    </main>
  );
}
