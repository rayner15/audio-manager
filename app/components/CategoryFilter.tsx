import { useCallback } from "react";
import { getCategoryColor } from "../../utils/audio";

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const handleCategoryClick = useCallback(
    (categoryId: string | null) => {
      onSelectCategory(categoryId);
    },
    [onSelectCategory]
  );

  // Get category color with categories array
  const getCategoryColorSafe = (category: Category) => {
    return getCategoryColor(category.id, categories);
  };

  return (
    <div className="px-4 py-3 border-t border-white/10">
      <p className="text-sm text-white/70 mb-2">Filter by category:</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ease-in-out backdrop-blur-sm
            ${
              selectedCategory === null
                ? "bg-white/50 text-white ring-2 ring-white/50 shadow-lg transform scale-105"
                : "bg-white/15 text-white/80 hover:bg-white/25"
            }`}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            style={{
              backgroundColor:
                selectedCategory === category.id
                  ? getCategoryColorSafe(category)
                  : "rgba(255, 255, 255, 0.15)",
              transition: "all 0.3s ease-in-out",
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ease-in-out backdrop-blur-sm
              ${
                selectedCategory === category.id
                  ? "text-white ring-2 ring-white/50 shadow-lg transform scale-105"
                  : "text-white/80 hover:bg-white/25"
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
