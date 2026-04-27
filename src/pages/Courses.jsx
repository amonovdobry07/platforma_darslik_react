import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  Loader2,
  TrendingUp,
  Clock,
  DollarSign,
  Star,
  SlidersHorizontal,
  Gift,
  CreditCard,
  BookOpen,
} from "lucide-react";
import { coursesAPI } from "../api/courses";
import CourseCard from "../components/course/CourseCard";
import EmptyState from "../components/ui/EmptyState";
import SEO from "../components/seo/SEO";
import "./Courses.css";

function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter holatlari (URL'dan o'qiymiz)
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "all",
    level: searchParams.get("level") || "all",
    price_type: searchParams.get("price_type") || "all",
    sort: searchParams.get("sort") || "popular",
  });

  // Kategoriyalarni yuklash
  useEffect(() => {
    loadCategories();
  }, []);

  // Filter o'zgarganda kurslarni qaytadan yuklash
  useEffect(() => {
    const debounce = setTimeout(() => {
      loadCourses();
      updateURL();
    }, 300); // 300ms debounce

    return () => clearTimeout(debounce);
  }, [filters]);

  const loadCategories = async () => {
    try {
      const data = await coursesAPI.getCategories();
      setCategories(data.results || data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      // Bo'sh maydonlarni yubormaslik uchun tozalash
      const params = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key] && filters[key] !== "all") {
          params[key] = filters[key];
        }
      });

      const data = await coursesAPI.getAll(params);
      setCourses(data.results || data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (
        filters[key] &&
        filters[key] !== "all" &&
        filters[key] !== "popular"
      ) {
        params.set(key, filters[key]);
      }
    });
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "all",
      level: "all",
      price_type: "all",
      sort: "popular",
    });
  };

  const activeFiltersCount = Object.keys(filters).filter((key) => {
    if (key === "search") return filters[key].trim() !== "";
    if (key === "sort") return false;
    return filters[key] !== "all";
  }).length;

  return (
    <>
      <SEO
        title="Barcha kurslar"
        description="Eng yaxshi online kurslar bir joyda. Dasturlash, dizayn, marketing va ko'plab boshqa sohalar. Bepul va pullik kurslar mavjud."
        keywords="kurslar, online kurslar, bepul kurslar, dasturlash, dizayn"
        url="/courses"
      />

      <div className="courses-page">
        {/* ============ HEADER ============ */}
        <section className="courses-header">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1>
                <span className="gradient-text">Kurslarni</span> kashf eting
              </h1>
              <p>
                {courses.length > 0
                  ? `${courses.length} ta kurs mavjud`
                  : "Sizga mos kursni toping"}
              </p>
            </motion.div>

            {/* SEARCH BAR */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="search-bar"
            >
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Kurs nomi yoki o'qituvchi nomini kiriting..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="search-input"
              />
              {filters.search && (
                <button
                  className="search-clear"
                  onClick={() => handleFilterChange("search", "")}
                >
                  <X size={18} />
                </button>
              )}
            </motion.div>
          </div>
        </section>

        {/* ============ MAIN CONTENT ============ */}
        <section className="courses-main">
          <div className="container">
            <div className="courses-layout">
              {/* ============ FILTERS SIDEBAR ============ */}
              <aside
                className={`filters-sidebar ${showMobileFilters ? "active" : ""}`}
              >
                <div className="filters-header">
                  <h3>
                    <SlidersHorizontal size={18} />
                    Filterlar
                    {activeFiltersCount > 0 && (
                      <span className="filter-badge">{activeFiltersCount}</span>
                    )}
                  </h3>

                  <button
                    className="filters-close-mobile"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    <X size={20} />
                  </button>

                  {activeFiltersCount > 0 && (
                    <button className="filter-reset" onClick={resetFilters}>
                      Tozalash
                    </button>
                  )}
                </div>

                {/* KATEGORIYA */}
                <div className="filter-group">
                  <label className="filter-label">Kategoriya</label>
                  <div className="filter-options">
                    <button
                      className={`filter-option ${filters.category === "all" ? "active" : ""}`}
                      onClick={() => handleFilterChange("category", "all")}
                    >
                      <BookOpen size={16} />
                      <span>Hammasi</span>
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        className={`filter-option ${filters.category === cat.slug ? "active" : ""}`}
                        onClick={() => handleFilterChange("category", cat.slug)}
                      >
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* DARAJA */}
                <div className="filter-group">
                  <label className="filter-label">Daraja</label>
                  <div className="filter-options">
                    <button
                      className={`filter-option ${filters.level === "all" ? "active" : ""}`}
                      onClick={() => handleFilterChange("level", "all")}
                    >
                      Hammasi
                    </button>
                    <button
                      className={`filter-option ${filters.level === "beginner" ? "active" : ""}`}
                      onClick={() => handleFilterChange("level", "beginner")}
                    >
                      Boshlang'ich
                    </button>
                    <button
                      className={`filter-option ${filters.level === "intermediate" ? "active" : ""}`}
                      onClick={() =>
                        handleFilterChange("level", "intermediate")
                      }
                    >
                      O'rta
                    </button>
                    <button
                      className={`filter-option ${filters.level === "advanced" ? "active" : ""}`}
                      onClick={() => handleFilterChange("level", "advanced")}
                    >
                      Yuqori
                    </button>
                  </div>
                </div>

                {/* NARX TURI */}
                <div className="filter-group">
                  <label className="filter-label">Narx</label>
                  <div className="filter-options">
                    <button
                      className={`filter-option ${filters.price_type === "all" ? "active" : ""}`}
                      onClick={() => handleFilterChange("price_type", "all")}
                    >
                      Hammasi
                    </button>
                    <button
                      className={`filter-option ${filters.price_type === "free" ? "active" : ""}`}
                      onClick={() => handleFilterChange("price_type", "free")}
                    >
                      <Gift size={16} />
                      <span>Bepul</span>
                    </button>
                    <button
                      className={`filter-option ${filters.price_type === "paid" ? "active" : ""}`}
                      onClick={() => handleFilterChange("price_type", "paid")}
                    >
                      <CreditCard size={16} />
                      <span>Pullik</span>
                    </button>
                  </div>
                </div>
              </aside>

              {/* ============ COURSES LIST ============ */}
              <main className="courses-content">
                {/* Toolbar */}
                <div className="courses-toolbar">
                  <button
                    className="filter-btn-mobile"
                    onClick={() => setShowMobileFilters(true)}
                  >
                    <Filter size={18} />
                    <span>Filterlar</span>
                    {activeFiltersCount > 0 && (
                      <span className="filter-badge">{activeFiltersCount}</span>
                    )}
                  </button>

                  <div className="sort-dropdown">
                    <label>Saralash:</label>
                    <select
                      value={filters.sort}
                      onChange={(e) =>
                        handleFilterChange("sort", e.target.value)
                      }
                      className="sort-select"
                    >
                      <option value="popular">🔥 Eng mashhur</option>
                      <option value="newest">✨ Eng yangi</option>
                      <option value="oldest">📅 Eng eski</option>
                      <option value="cheapest">💰 Eng arzon</option>
                      <option value="expensive">💎 Eng qimmat</option>
                      <option value="rating">⭐ Reyting bo'yicha</option>
                    </select>
                  </div>
                </div>

                {/* Results */}
                {isLoading ? (
                  <div className="courses-loading">
                    <Loader2 className="spinner" size={40} />
                  </div>
                ) : courses.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="courses-grid"
                  >
                    <AnimatePresence>
                      {courses.map((course, i) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <CourseCard course={course} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <EmptyState
                    icon={Search}
                    title="Kurs topilmadi"
                    description={
                      filters.search
                        ? `"${filters.search}" bo'yicha hech narsa topilmadi`
                        : "Filter sozlamalarini o'zgartiring"
                    }
                    actionLabel="Filterlarni tozalash"
                    actionOnClick={resetFilters}
                  />
                )}
              </main>
            </div>
          </div>
        </section>

        {/* Mobile filters overlay */}
        {showMobileFilters && (
          <div
            className="filters-overlay"
            onClick={() => setShowMobileFilters(false)}
          ></div>
        )}
      </div>
    </>
  );
}

export default Courses;
