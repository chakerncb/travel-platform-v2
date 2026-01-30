import 'package:flutter/material.dart';
import 'dart:ui';
import 'package:provider/provider.dart';
import 'package:TOURZ/util/theme_provider.dart';

class GlassHeader extends StatefulWidget {
  const GlassHeader({Key? key}) : super(key: key);

  @override
  _GlassHeaderState createState() => _GlassHeaderState();
}

class _GlassHeaderState extends State<GlassHeader>
    with SingleTickerProviderStateMixin {
  bool isSearchExpanded = false;
  TextEditingController searchController = TextEditingController();
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: Duration(milliseconds: 300),
      vsync: this,
    );
  }

  @override
  void dispose() {
    searchController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  void _toggleSearch() {
    setState(() {
      isSearchExpanded = !isSearchExpanded;
      if (isSearchExpanded) {
        _animationController.forward();
      } else {
        _animationController.reverse();
        searchController.clear();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: EdgeInsets.only(
          top: MediaQuery.of(context).padding.top + 8,
          bottom: 12,
          left: 16,
          right: 16,
        ),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Theme.of(context).scaffoldBackgroundColor,
              Theme.of(context).scaffoldBackgroundColor.withOpacity(0.9),
            ],
          ),
        ),
        child: Row(
          children: [
            // Search button/bar
            Expanded(
              child: AnimatedContainer(
                duration: Duration(milliseconds: 300),
                curve: Curves.easeInOut,
              ),
            ),
            SizedBox(width: 12),
            // Theme toggle button
            _buildThemeToggleButton(),
            SizedBox(width: 12),
            // Notification button
            _buildGlassNotificationButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildGlassSearchBar() {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          height: 48,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Colors.white.withOpacity(0.2),
                Colors.white.withOpacity(0.1),
              ],
            ),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: Colors.white.withOpacity(0.3),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: Theme.of(context).primaryColor.withOpacity(0.1),
                blurRadius: 20,
                spreadRadius: 0,
              ),
            ],
          ),
          child: Row(
            children: [
              // Search icon button
              Material(
                color: Colors.transparent,
                child: InkWell(
                  borderRadius: BorderRadius.circular(20),
                  onTap: _toggleSearch,
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    child: Icon(
                      isSearchExpanded ? Icons.close : Icons.search,
                      color: Theme.of(context).primaryColor,
                      size: 24,
                    ),
                  ),
                ),
              ),

              // Expandable search field
              Expanded(
                child: AnimatedSize(
                  duration: Duration(milliseconds: 300),
                  curve: Curves.easeInOut,
                  child: isSearchExpanded
                      ? TextField(
                          controller: searchController,
                          autofocus: true,
                          decoration: InputDecoration(
                            hintText: 'Search tours...',
                            hintStyle: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 15,
                            ),
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.symmetric(
                              horizontal: 0,
                              vertical: 14,
                            ),
                          ),
                          style: TextStyle(
                            fontSize: 15,
                            color: Theme.of(context).textTheme.bodyLarge?.color,
                          ),
                        )
                      : Text(
                          'Search destinations...',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 15,
                          ),
                        ),
                ),
              ),

              SizedBox(width: 12),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGlassNotificationButton() {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          height: 48,
          width: 48,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Colors.white.withOpacity(0.2),
                Colors.white.withOpacity(0.1),
              ],
            ),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: Colors.white.withOpacity(0.3),
              width: 1.5,
            ),
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              borderRadius: BorderRadius.circular(20),
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('No new notifications'),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
              child: Stack(
                children: [
                  Center(
                    child: Icon(
                      Icons.notifications_none,
                      color: Theme.of(context).primaryColor,
                      size: 24,
                    ),
                  ),
                  Positioned(
                    top: 10,
                    right: 10,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  // Theme Toggle Button
  Widget _buildThemeToggleButton() {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDark = themeProvider.isDark;

    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          height: 48,
          width: 48,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                isDark
                    ? Colors.black.withOpacity(0.3)
                    : Colors.white.withOpacity(
                        0.4,
                      ), // Different opacity for contrast
                isDark
                    ? Colors.black.withOpacity(0.1)
                    : Colors.white.withOpacity(0.2),
              ],
            ),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isDark
                  ? Colors.white.withOpacity(0.1)
                  : Colors.white.withOpacity(0.4),
              width: 1.5,
            ),
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              borderRadius: BorderRadius.circular(20),
              onTap: () {
                themeProvider.toggleTheme();
              },
              child: Center(
                child: Icon(
                  isDark ? Icons.light_mode : Icons.dark_mode,
                  color: isDark ? Colors.amber : Theme.of(context).primaryColor,
                  size: 24,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
