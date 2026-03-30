# BloodLink — Blood Bank Management System 🩸

**BloodLink** is a comprehensive, open-source blood bank administration and management platform. Our overarching motive is to bridge the gap between blood demand and supply by efficiently connecting willing blood donors, hospitals, and blood banks through a real-time, unified network.

![BloodLink Banner](https://via.placeholder.com/1200x400/0b0a1a/e11d48?text=BloodLink+Management+System)

## 📌 Features

- **Multi-Role Authentication & Portals:** Secure Role-Based Access Control (RBAC) accommodating Admins, Hospitals, and Donors.
- **Real-Time Blood Inventory:** Track available blood groups instantaneously across the entire network.
- **Intuitive Admin Panel:** Live telemetry and dynamic, interactive data visualization (powered by Recharts) showing blood distribution and system statistics.
- **Request & Donation Management:** Hospitals can request blood securely while donors can view drives and schedule donations.
- **Stunning UI/UX:** Built with a premium "glassmorphism" dark aesthetic, smooth responsive micro-animations, and vibrant gradients.

## 🛠 Tech Stack

- **Frontend Framework:** [Next.js](https://nextjs.org/) (App Router format for optimized server-side rendering and routing).
- **Styling:** Custom CSS variables combined with robust utility classes for a tailored dark theme.
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/) for beautiful, responsive SVG data visualization.
- **Backend/Database:** [Supabase](https://supabase.com/) handling PostgreSQL database management and user authentication.

## 🚀 Getting Started

Follow these instructions to set up the project on your local machine.

### Prerequisites

- Node.js 18.x or later installed.
- A Supabase Project (you'll need the Supabase URL and Anon Key for setup).

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/blood-bank.git
cd blood-bank
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

Create a file named `.env.local` in the root of your project and populate it with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server

Start the application on localhost:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the platform.

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome! We're dedicated to improving the process of blood donation globally. Feel free to check the [issues page](https://github.com/yourusername/blood-bank/issues).

## 📄 License

This project is licensed under the MIT License. Built with ❤️ for saving lives.
