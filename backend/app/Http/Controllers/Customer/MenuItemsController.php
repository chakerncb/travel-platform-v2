<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemsController extends Controller
{
  public function show(int $itemId){
     
    $item = MenuItem::find($itemId);
    if(!$item){
      return response()->json([
        "status"=> false,
        "message"=> "Menu Item Not Found"
    ],404);
  }

  return response()->json([
    "status"=> true,
    "message"=> "Menu Item retreived succufully",
    "item"=> $item
    ],200);
  }

  public function searchItem(string $itemName){
    $item = MenuItem::where("name","like","%".$itemName."%")->get();
    if(!$item){
      return response()->json([
        "status"=> false,
        "message"=> "Menu Item Not Found"
      ],404);
    }

    return response()->json([
      "status"=> true,
      "message"=> "Menu Item retreived succufully",
      "item"=> $item
    ],200);

  }


}
