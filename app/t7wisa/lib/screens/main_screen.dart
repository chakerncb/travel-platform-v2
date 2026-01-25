import 'package:flutter/material.dart';
import 'package:TOURZ/screens/home.dart';
import 'package:TOURZ/screens/profile.dart';
import 'package:TOURZ/screens/all_tours_screen.dart';
import 'package:TOURZ/widgets/glass_header.dart';
import 'package:hydro_glass_nav_bar/hydro_glass_nav_bar.dart';

class MainScreen extends StatefulWidget {
  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Main content area with tabs
          TabBarView(
            controller: _tabController,
            children: [
              Home(),
              AllToursScreen(),
              _buildPlaceholderScreen(
                icon: Icons.mode_comment,
                title: 'Messages',
                subtitle: 'Your messages and notifications',
              ),
              Profile(),
            ],
          ),

          // Global glass morphism header (search + notifications)
          GlassHeader(),

          // Floating hydro glass navigation bar
          HydroGlassNavBar(
            controller: _tabController,
            items: [
              HydroGlassNavItem(
                label: 'Home',
                icon: Icons.home_outlined,
                selectedIcon: Icons.home,
              ),
              HydroGlassNavItem(
                label: 'All Tours',
                icon: Icons.explore_outlined,
                selectedIcon: Icons.explore,
              ),
              HydroGlassNavItem(
                label: 'Messages',
                icon: Icons.mode_comment_outlined,
                selectedIcon: Icons.mode_comment,
              ),
              HydroGlassNavItem(
                label: 'Profile',
                icon: Icons.person_outline,
                selectedIcon: Icons.person,
              ),
            ],
            showIndicator: true,
            useLiquidGlass: true,
          ),
        ],
      ),
    );
  }

  // Helper widget for placeholder screens
  Widget _buildPlaceholderScreen({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Padding(
      padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top + 72),
      child: Center(
        child: Padding(
          padding: EdgeInsets.all(40),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 120, color: Colors.grey[300]),
              SizedBox(height: 24),
              Text(
                title,
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 12),
              Text(
                subtitle,
                style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
