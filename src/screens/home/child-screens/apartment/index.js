import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { fetchAvailableApartments } from "../../../../endpoints/apartment.service";
import DateTimePicker from "@react-native-community/datetimepicker";

const generateDateRange = (startDate, endDate) => {
  let dates = [];
  let currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    dates.push(new Date(currentDate).toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const ApartmentList = () => {
  const [availableApt, setAvailableApt] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [visibleDays, setVisibleDays] = useState(20); // Show 20 days initially
  const [showAvailable, setShowAvailable] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  // Fetch apartment availability based on selected date range
  const _fetchAvailableApartments = async () => {
    try {
      const start = startDate.toISOString();
      const checkOut = endDate.toISOString();
      const apartments = await fetchAvailableApartments(start, checkOut);
      setAvailableApt(apartments);
    } catch (error) {
      console.error("Error fetching available apartments:", error);
    }
  };

  // Generate date range for the last 2 months and next 2 months
  const generateFullDateRange = () => {
    const currentDate = new Date();
    const start = new Date();
    start.setMonth(currentDate.getMonth() - 2); // 2 months ago
    const end = new Date();
    end.setMonth(currentDate.getMonth() + 2); // 2 months ahead

    return generateDateRange(start, end);
  };

  // Handle start date change from DateTimePicker
  const handleStartDateChange = (event, selectedDate) => {
    setShowFromDatePicker(false); // Hide picker
    if (selectedDate) setStartDate(selectedDate); // Update state with new date
  };

  // Handle end date change from DateTimePicker
  const handleEndDateChange = (event, selectedDate) => {
    setShowToDatePicker(false); // Hide picker
    if (selectedDate) setEndDate(selectedDate); // Update state with new date
  };

  // Re-fetch apartments whenever start or end date changes
  useEffect(() => {
    _fetchAvailableApartments();
  }, [startDate, endDate]);

  // Render each apartment row
  const renderApartmentRow = ({ item }) => (
    <View style={styles.apartmentRow}>
      {/* Apartment Name */}
      <Text style={styles.apartmentName}>{item.name}</Text>

      {/* Horizontal Scroll for Availability */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {generateFullDateRange().slice(0, visibleDays).map((date, index) => (
          <View
            key={index}
            style={[
              styles.availabilityItem,
              item.isActive ? styles.available : styles.unavailable,
            ]}
          >
            <Text style={styles.tick}>{item.isActive ? "✓" : ""}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  // Render the header with apartment name and dates
  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={styles.headerText}>Apt Name</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {generateFullDateRange().slice(0, visibleDays).map((date, index) => (
          <Text key={index} style={styles.headerDate}>
            {date.split("-")[2]}/{date.split("-")[1]}
          </Text>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Date Range Picker */}
      <View style={styles.datecard}>
        <TouchableOpacity
          onPress={() => setShowAvailable(!showAvailable)}
          style={[styles.dateBox, { backgroundColor: "#fff" }]}
        >
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownText}>Date Range</Text>
            <Icon
              name={showAvailable ? "chevron-up" : "chevron-down"}
              size={20}
              color="#000"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginLeft: 14 }}
          onPress={_fetchAvailableApartments}
        >
          <Icon name="search" size={28} color="#000000" />
        </TouchableOpacity>
      </View>


      {showAvailable && (
        <View>
          {/* Start Date Picker */}
          <View style={styles.datePickerContainer}>
            <Text>From:</Text>
            <TouchableOpacity
              onPress={() => setShowFromDatePicker(true)}
              style={styles.dateButton}
            >
              <Text>{startDate.toDateString()}</Text>
            </TouchableOpacity>
            {showFromDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
              />
            )}
          </View>


          <View style={styles.datePickerContainer}>
            <Text>To:</Text>
            <TouchableOpacity
              onPress={() => setShowToDatePicker(true)}
              style={styles.dateButton}
            >
              <Text>{endDate.toDateString()}</Text>
            </TouchableOpacity>
            {showToDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
              />
            )}
          </View>
        </View>
      )}

      {/* Apartment List with Fixed Header */}
      {availableApt.length > 0 ? (
        <>
          {renderHeader()}
          <FlatList
            data={availableApt}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderApartmentRow}
          />
        </>
      ) : (
        <Text style={{ textAlign: "center" }}>Apartment not found</Text>
      )}
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  datecard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  dateBox: {
    padding: 15,
    borderColor: "#A9A9A9",
    borderWidth: 1,
    borderRadius: 10,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "500",
  },
  datePickerContainer: {
    marginVertical: 10,
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#E9EAEC",
    borderRadius: 5,
    marginTop: 5,
  },
  headerRow: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    width: Dimensions.get("window").width / 4, // Fixed width for Apt Name
  },
  headerDate: {
    fontSize: 14,
    marginHorizontal: 10,
  },
  apartmentRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  apartmentName: {
    fontSize: 16,
    fontWeight: "bold",
    width: Dimensions.get("window").width / 4, // Fixed width for Apt Name
  },
  availabilityItem: {
    width: 50, // Fixed width for each date box
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 6,
  },
  tick: {
    fontSize: 16,
    color: "#fff",
  },
  available: {
    backgroundColor: "#7b68ee",
  },
  unavailable: {
    backgroundColor: "#ffffff",
  },
});

export default ApartmentList;
