import 'package:flutter/material.dart';
import 'package:t7wisa/models/tour.dart';
import 'package:t7wisa/services/api_service.dart';
import 'package:t7wisa/widgets/horizontal_place_item.dart';
import 'package:t7wisa/widgets/icon_badge.dart';
import 'package:t7wisa/widgets/search_bar.dart' as custom;
import 'package:t7wisa/widgets/vertical_place_item.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  List<Tour> tours = [];
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    fetchTours();
  }

  Future<void> fetchTours() async {
    try {
      setState(() {
        isLoading = true;
        errorMessage = null;
      });

      final fetchedTours = await ApiService.fetchTours(active: true);

      setState(() {
        tours = fetchedTours;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = 'Failed to load tours: $e';
        isLoading = false;
      });
      print('Error fetching tours: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Container(
          margin: EdgeInsets.symmetric(vertical: 20.0),
          child: custom.CustomSearchBar(),
        ),
        actions: <Widget>[
          IconButton(
            icon: IconBadge(icon: Icons.notifications_none),
            onPressed: () {},
          ),
        ],
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : errorMessage != null
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    errorMessage!,
                    style: TextStyle(color: Colors.red),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 16),
                  ElevatedButton(onPressed: fetchTours, child: Text('Retry')),
                ],
              ),
            )
          : tours.isEmpty
          ? Center(child: Text('No tours available'))
          : RefreshIndicator(
              onRefresh: fetchTours,
              child: ListView(
                children: <Widget>[
                  buildHorizontalList(context),
                  buildVerticalList(),
                ],
              ),
            ),
    );
  }

  buildHorizontalList(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(top: 10.0, left: 20.0),
      height: 240.0,
      width: MediaQuery.of(context).size.width,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        primary: false,
        itemCount: tours.length,
        itemBuilder: (BuildContext context, int index) {
          Tour tour = tours.reversed.toList()[index];
          return HorizontalPlaceItem(place: tour.toJson());
        },
      ),
    );
  }

  buildVerticalList() {
    return Padding(
      padding: EdgeInsets.all(20.0),
      child: ListView.builder(
        primary: false,
        physics: NeverScrollableScrollPhysics(),
        shrinkWrap: true,
        itemCount: tours.length,
        itemBuilder: (BuildContext context, int index) {
          Tour tour = tours[index];
          return VerticalPlaceItem(place: tour.toJson());
        },
      ),
    );
  }
}
