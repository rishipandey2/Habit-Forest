import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  Plus,
  Edit3,
  Trash2,
  Check,
  Flame,
  Trophy,
  LogOut,
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserPlus,
  TreePine,
  Sparkles,
  Target,
} from "lucide-react";
import { authAPI, dbAPI } from "./appwrite/api";

// Utility functions
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

const calculateStreak = (completions, habitId) => {
  if (!completions.length) return 0;

  // Get unique dates for this habit, sorted from newest to oldest
  const habitCompletionDates = [
    ...new Set(
      completions.filter((c) => c.habitId === habitId).map((c) => c.date)
    ),
  ].sort((a, b) => new Date(b) - new Date(a));

  if (!habitCompletionDates.length) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check each unique date to see if it's consecutive
  for (let i = 0; i < habitCompletionDates.length; i++) {
    const completionDate = new Date(habitCompletionDates[i]);
    completionDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - streak);

    if (completionDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

const getTreeStage = (streak) => {
  if (streak >= 30) return "mighty";
  if (streak >= 14) return "mature";
  if (streak >= 7) return "growing";
  if (streak >= 3) return "sprout";
  return "seed";
};

const getTreeEmoji = (stage) => {
  const trees = {
    seed: "🌱",
    sprout: "🌿",
    growing: "🌳",
    mature: "🌲",
    mighty: "🏔️",
  };
  return trees[stage] || "🌱";
};

// Components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-12">
    <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-700"></div>
  </div>
);

const Button = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary:
      "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500 disabled:bg-gray-300 disabled:text-gray-500",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300 border border-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost:
      "text-gray-600 hover:bg-gray-100 focus:ring-gray-300 hover:text-gray-900",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  className = "",
}) => (
  <div className="relative">
    {Icon && (
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2.5 ${
        Icon ? "pl-10" : ""
      } text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 placeholder-gray-500 ${className}`}
    />
  </div>
);

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-90vh overflow-y-auto shadow-xl border border-gray-200">
        {children}
      </div>
    </div>
  );
};

const LoginForm = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      await authAPI.createSession(email, password);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-xl mb-6">
            <TreePine className="h-8 w-8 text-gray-700" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600 text-sm">
            Sign in to continue growing your habit forest
          </p>
        </div>

        <div className="space-y-4" onKeyPress={handleKeyPress}>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
              icon={Mail}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={setPassword}
                icon={Lock}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full justify-center"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-gray-900 hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SignupForm = ({ onSignup, onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      await authAPI.createAccount(email, password, name);
      onSignup();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-xl mb-6">
            <TreePine className="h-8 w-8 text-gray-700" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Create account
          </h1>
          <p className="text-gray-600 text-sm">
            Start your journey to better habits today
          </p>
        </div>

        <div className="space-y-4" onKeyPress={handleKeyPress}>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Full name
            </label>
            <Input
              placeholder="Enter your full name"
              value={name}
              onChange={setName}
              icon={User}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
              icon={Mail}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={setPassword}
                icon={Lock}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full justify-center"
          >
            <UserPlus className="h-4 w-4" />
            {loading ? "Creating account..." : "Create account"}
          </Button>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-gray-900 hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HabitCard = ({
  habit,
  streak,
  onComplete,
  onEdit,
  onDelete,
  isCompleted,
  lastCompleted,
}) => {
  const treeStage = getTreeStage(streak);
  const treeEmoji = getTreeEmoji(treeStage);

  const stageColors = {
    seed: "bg-yellow-50 text-yellow-700 border-yellow-200",
    sprout: "bg-green-50 text-green-700 border-green-200",
    growing: "bg-emerald-50 text-emerald-700 border-emerald-200",
    mature: "bg-blue-50 text-blue-700 border-blue-200",
    mighty: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 mb-1 truncate">
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-gray-500 text-sm line-clamp-2">
              {habit.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-3 flex-shrink-0">
          <button
            onClick={() => onEdit(habit)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(habit.$id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="text-5xl">{treeEmoji}</div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Current streak</span>
          <div className="flex items-center gap-1.5 text-orange-600">
            <Flame className="h-4 w-4" />
            <span className="font-medium">{streak} days</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Growth stage</span>
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium capitalize border ${stageColors[treeStage]}`}
          >
            {treeStage}
          </span>
        </div>

        {lastCompleted && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last completed</span>
            <span className="text-gray-900 font-medium">
              {new Date(lastCompleted).toLocaleDateString()}
            </span>
          </div>
        )}

        <Button
          onClick={() => onComplete(habit.$id)}
          disabled={isCompleted}
          variant={isCompleted ? "secondary" : "primary"}
          className="w-full justify-center mt-6"
        >
          <Check className="h-4 w-4" />
          {isCompleted ? "Completed today" : "Mark as done"}
        </Button>
      </div>
    </div>
  );
};

const HabitModal = ({ isOpen, onClose, habit, onSave }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (habit) {
      setName(habit.name || "");
      setDescription(habit.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [habit]);

  const handleSave = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
      });
      onClose();
    } catch (error) {
      console.error("Error saving habit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      handleSave();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {habit ? "Edit habit" : "Create new habit"}
        </h2>

        <div className="space-y-5" onKeyPress={handleKeyPress}>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Habit name
            </label>
            <Input
              placeholder="e.g. Drink 8 glasses of water"
              value={name}
              onChange={setName}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description (optional)
            </label>
            <textarea
              placeholder="Add more details about your habit..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 placeholder-gray-500 resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={loading || !name.trim()}
              className="flex-1 justify-center"
            >
              {loading ? "Saving..." : habit ? "Save changes" : "Create habit"}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const Dashboard = ({ user, onLogout }) => {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [habitModal, setHabitModal] = useState({ open: false, habit: null });
  const [totalPoints, setTotalPoints] = useState(0);

  // Updated to use real Appwrite API
  const loadData = useCallback(async () => {
    try {
      const [habitsResponse, completionsResponse] = await Promise.all([
        dbAPI.getHabits(user.$id),
        dbAPI.getCompletions(user.$id),
      ]);

      setHabits(habitsResponse.documents);
      setCompletions(completionsResponse.documents);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [user.$id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const points = completions.length * 10;
    setTotalPoints(points);
  }, [completions]);

  // Updated to use real Appwrite API
  const handleCreateHabit = async (habitData) => {
    await dbAPI.createHabit({
      ...habitData,
      userId: user.$id,
    });
    await loadData();
  };

  // Updated to use real Appwrite API
  const handleEditHabit = async (habitData) => {
    await dbAPI.updateHabit(habitModal.habit.$id, habitData);
    await loadData();
  };

  // Updated to use real Appwrite API
  const handleDeleteHabit = async (habitId) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      await dbAPI.deleteHabit(habitId);
      await dbAPI.deleteHabitCompletions(habitId);
      await loadData();
    }
  };

  // Updated to use real Appwrite API
  const handleCompleteHabit = async (habitId) => {
    const today = formatDate(new Date());
    const existingCompletion = completions.find(
      (c) => c.habitId === habitId && c.date === today
    );

    if (existingCompletion) return;

    await dbAPI.createCompletion({
      habitId,
      userId: user.$id,
      date: today,
    });

    await loadData();
  };

  const isHabitCompletedToday = (habitId) => {
    const today = formatDate(new Date());
    return completions.some((c) => c.habitId === habitId && c.date === today);
  };

  const getHabitStreak = (habitId) => {
    return calculateStreak(completions, habitId);
  };

  const getLastCompleted = (habitId) => {
    const habitCompletions = completions
      .filter((c) => c.habitId === habitId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return habitCompletions.length > 0 ? habitCompletions[0].date : null;
  };

  const todayCompletions = completions.filter(
    (c) => c.date === formatDate(new Date())
  ).length;
  // Calculate total unique days with any habit completions
  const totalStreakDays = (() => {
    if (!completions.length) return 0;

    // Get all unique dates with any completions, sorted newest to oldest
    const allCompletionDates = [
      ...new Set(completions.map((c) => c.date)),
    ].sort((a, b) => new Date(b) - new Date(a));

    if (!allCompletionDates.length) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check consecutive days with any habit completions
    for (let i = 0; i < allCompletionDates.length; i++) {
      const completionDate = new Date(allCompletionDates[i]);
      completionDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - streak);

      if (completionDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  })();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <TreePine className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Habit Forest
                </h1>
                <p className="text-sm text-gray-600">{user.name}'s workspace</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Trophy className="h-4 w-4" />
                <span className="font-medium">{totalPoints} points</span>
              </div>
              <Button variant="ghost" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Today's progress
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {todayCompletions} / {habits.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total streak
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalStreakDays} days
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TreePine className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active habits
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {habits.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Habits Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your habits</h2>
            <p className="text-gray-600 text-sm mt-1">
              Track your daily progress and watch your forest grow
            </p>
          </div>
          <Button onClick={() => setHabitModal({ open: true, habit: null })}>
            <Plus className="h-4 w-4" />
            New habit
          </Button>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <TreePine className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No habits yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
              Create your first habit to start building your daily routine and
              growing your personal forest
            </p>
            <Button onClick={() => setHabitModal({ open: true, habit: null })}>
              <Plus className="h-4 w-4" />
              Create your first habit
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {habits.map((habit) => (
              <HabitCard
                key={habit.$id}
                habit={habit}
                streak={getHabitStreak(habit.$id)}
                onComplete={handleCompleteHabit}
                onEdit={(habit) => setHabitModal({ open: true, habit })}
                onDelete={handleDeleteHabit}
                isCompleted={isHabitCompletedToday(habit.$id)}
                lastCompleted={getLastCompleted(habit.$id)}
              />
            ))}
          </div>
        )}

        {/* Achievement Section */}
        {totalStreakDays > 0 && (
          <div className="mt-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-8 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  Incredible progress!
                </h3>
                <p className="text-gray-700">
                  You've maintained your habits for {totalStreakDays} total
                  days. Your forest is thriving—keep up the amazing work! 🌲
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <HabitModal
        isOpen={habitModal.open}
        onClose={() => setHabitModal({ open: false, habit: null })}
        habit={habitModal.habit}
        onSave={habitModal.habit ? handleEditHabit : handleCreateHabit}
      />
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authAPI.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    const currentUser = await authAPI.getCurrentUser();
    setUser(currentUser);
  };

  const handleLogout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return showSignup ? (
      <SignupForm
        onSignup={handleLogin}
        onSwitchToLogin={() => setShowSignup(false)}
      />
    ) : (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToSignup={() => setShowSignup(true)}
      />
    );
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
};

export default App;
