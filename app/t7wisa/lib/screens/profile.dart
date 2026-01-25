import 'package:flutter/material.dart';
import 'package:TOURZ/models/user.dart';
import 'package:TOURZ/screens/login.dart';
import 'package:TOURZ/services/auth_service.dart';
import 'package:skeletonizer/skeletonizer.dart';

class Profile extends StatefulWidget {
  @override
  _ProfileState createState() => _ProfileState();
}

class _ProfileState extends State<Profile> {
  User? user;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    loadUserData();
  }

  Future<void> loadUserData() async {
    setState(() {
      isLoading = true;
    });

    final isLoggedIn = await AuthService.isLoggedIn();

    if (isLoggedIn) {
      final userData = await AuthService.getUser();
      setState(() {
        user = userData;
        isLoading = false;
      });
    } else {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> handleLogout() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Logout'),
        content: Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: Text('Logout'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await AuthService.logout();
      setState(() {
        user = null;
      });

      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Logged out successfully')));
    }
  }

  // Fake user for skeleton loading
  User get _fakeUser => User(
    id: 0,
    fName: 'John',
    lName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    address: '123 Fake Street, City, Country',
    isAdmin: false,
    createdAt: DateTime.now(),
  );

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      // Show skeleton with fake user data
      return Skeletonizer(
        enabled: true,
        child: _buildProfileContent(_fakeUser),
      );
    }

    if (user == null) {
      return _buildLoginPrompt();
    }

    return _buildProfileContent(user!);
  }

  Widget _buildLoginPrompt() {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.account_circle, size: 120, color: Colors.grey[300]),
            SizedBox(height: 24),
            Text(
              'Welcome!',
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 12),
            Text(
              'Please login to access your profile and book tours',
              style: TextStyle(fontSize: 16, color: Colors.grey[600]),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 32),
            ElevatedButton(
              onPressed: () async {
                await Navigator.of(
                  context,
                ).push(MaterialPageRoute(builder: (context) => Login()));
                loadUserData();
              },
              style: ElevatedButton.styleFrom(
                padding: EdgeInsets.symmetric(horizontal: 48, vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Text('Login', style: TextStyle(fontSize: 16)),
            ),
          ],
        ),
      ),
    );
  }

  // Extracted profile building logic to verify against fake user
  Widget _buildProfileContent(User userData) {
    return ListView(
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 92,
        left: 20,
        right: 20,
        bottom: 100,
      ),
      children: [
        SizedBox(height: 20),
        Center(
          child: Column(
            children: [
              CircleAvatar(
                radius: 50,
                backgroundColor: Theme.of(context).colorScheme.secondary,
                child: Text(
                  '${userData.fName.isNotEmpty ? userData.fName[0] : ''}${userData.lName.isNotEmpty ? userData.lName[0] : ''}'
                      .toUpperCase(),
                  style: TextStyle(
                    fontSize: 36,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              SizedBox(height: 16),
              Text(
                userData.fullName,
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              Text(
                userData.email,
                style: TextStyle(fontSize: 16, color: Colors.grey[600]),
              ),
              if (userData.emailVerifiedAt != null) ...[
                SizedBox(height: 8),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.green[50],
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.verified, size: 16, color: Colors.green),
                      SizedBox(width: 5),
                      Text(
                        'Verified',
                        style: TextStyle(
                          color: Colors.green,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
        SizedBox(height: 40),
        _buildInfoCard('Phone', userData.phone ?? 'Not provided', Icons.phone),
        _buildInfoCard(
          'Address',
          userData.address ?? 'Not provided',
          Icons.location_on,
        ),
        _buildInfoCard(
          'Member Since',
          userData.createdAt != null
              ? '${userData.createdAt!.day}/${userData.createdAt!.month}/${userData.createdAt!.year}'
              : 'N/A',
          Icons.calendar_today,
        ),
        SizedBox(height: 30),
        ListTile(
          leading: Icon(Icons.history, color: Colors.blue),
          title: Text('My Bookings'),
          trailing: Icon(Icons.arrow_forward_ios, size: 16),
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Bookings feature coming soon!')),
            );
          },
        ),
        Divider(),
        ListTile(
          leading: Icon(Icons.favorite, color: Colors.red),
          title: Text('Wishlist'),
          trailing: Icon(Icons.arrow_forward_ios, size: 16),
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Wishlist feature coming soon!')),
            );
          },
        ),
        Divider(),
        ListTile(
          leading: Icon(Icons.settings, color: Colors.grey),
          title: Text('Settings'),
          trailing: Icon(Icons.arrow_forward_ios, size: 16),
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Settings feature coming soon!')),
            );
          },
        ),
        Divider(),
        SizedBox(height: 20),
        // Hide logout button in skeleton mode or make it non-interactive
        isLoading
            ? SizedBox.shrink()
            : ElevatedButton.icon(
                onPressed: handleLogout,
                icon: Icon(Icons.logout),
                label: Text('Logout'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
      ],
    );
  }

  Widget _buildInfoCard(String label, String value, IconData icon) {
    return Card(
      margin: EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Icon(icon, color: Theme.of(context).colorScheme.secondary),
        title: Text(
          label,
          style: TextStyle(fontSize: 14, color: Colors.grey[600]),
        ),
        subtitle: Text(
          value,
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
        ),
      ),
    );
  }
}
