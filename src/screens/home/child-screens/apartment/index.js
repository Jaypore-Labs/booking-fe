import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { fetchAvailableApartmentsDate } from "../../../../endpoints/apartment.service";
import DateTimePicker from "@react-native-community/datetimepicker";

const generateDateRange = (startDate, endDate) => {
  let dates = [];
  let currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  // Loop through the date range
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
  const [visibleDays, setVisibleDays] = useState(20);
  const [showAvailable, setShowAvailable] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  const scrollX = useRef(new Animated.Value(0)).current;
  const headerScrollRef = useRef(null); // Ref for the header scroll views
  const contentScrollRefs = useRef([]);

  const _fetchAvailableApartmentsDate = async () => {
    try {
      const checkIn = startDate.toISOString();
      const checkOut = endDate.toISOString();
      const apartments = await fetchAvailableApartmentsDate(checkIn, checkOut);
      setAvailableApt(apartments);
    } catch (error) {
      console.error("Error fetching available apartments Date:", error);
    }
  };

  const generateFullDateRange = () => {
    return generateDateRange(startDate, endDate);
  };

  const minimumEndDate = new Date(startDate);
  minimumEndDate.setDate(startDate.getDate() + 1);

  const handleStartDateChange = (event, selectedDate) => {
    setShowFromDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      if (endDate < selectedDate) {
        setEndDate(selectedDate);
      }
    }
    setShowFromDatePicker(false);
    // if (selectedDate) setStartDate(selectedDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowToDatePicker(false);
    if (selectedDate) {
      if (selectedDate > startDate) {
        setEndDate(selectedDate);
      } else {
        alert("from date must be after to date.");
      }
    }
    setShowToDatePicker(false);
    // if (selectedDate) setEndDate(selectedDate);
  };

  const handleScrollSync = (scrollEvent) => {
    const offsetX = scrollEvent.nativeEvent.contentOffset.x;
    headerScrollRef.current?.scrollTo({ x: offsetX, animated: false });
    contentScrollRefs.current.forEach((ref) => {
      ref?.scrollTo({ x: offsetX, animated: false });
    });
  };
  // Render the header with dates and synchronize scrolling
  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={styles.headerText}>Apt Name</Text>
      <Animated.ScrollView
        ref={headerScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScrollSync}
      // onScroll={handleScrollSync}
      >
        {generateFullDateRange()
          .slice(0, visibleDays)
          .map((date, index) => (
            <Text key={index} style={styles.headerDate}>
              {date.split("-")[2]}/{date.split("-")[1]}
            </Text>
          ))}
      </Animated.ScrollView>
    </View>
  );

  // Render each apartment row and synchronize scrolling
  const renderApartmentRow = ({ item, index }) => (
    <View style={styles.apartmentRow}>
      <Text style={styles.apartmentName}>{item.name}</Text>

      <Animated.ScrollView
        ref={(ref) => (contentScrollRefs.current[index] = ref)}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        scrollEnabled={true} // Enable scrolling
        onMomentumScrollEnd={handleScrollSync}
        onScroll={handleScrollSync}
      >
        {generateFullDateRange()
          .slice(0, visibleDays)
          .map((date, dateIndex) => {
            console.log(date);
            console.log(item.availability);
            const isAvailable = item.availability[date] ?? null;
            console.log(isAvailable);
            return (
              <View
                key={dateIndex}
                style={[
                  styles.availabilityItem,
                  isAvailable === true ? styles.available : styles.unavailable,
                ]}
              >
                <Text style={styles.tick}>
                  {isAvailable === true ? "✓" : "✗"}
                </Text>
              </View>
            );
          })}
      </Animated.ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
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
          onPress={_fetchAvailableApartmentsDate}
        >
          <Icon name="search" size={28} color="#000000" />
        </TouchableOpacity>
      </View>

      {showAvailable && (
        <View style={{ padding: 16 }}>
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
                minimumDate={new Date()}
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
                minimumDate={minimumEndDate}
              />
            )}
          </View>
        </View>
      )}

      {availableApt.length > 0 ? (
        <View style={{ padding: 20 }}>
          {renderHeader()}
          <FlatList
            data={availableApt}
            keyExtractor={(item) => item._id}
            renderItem={renderApartmentRow}
          />
        </View>
      ) : (
        <Text style={{ textAlign: "center", marginTop: 6 }}>
          Apartment not found
        </Text>
      )}
    </SafeAreaView>
  );
};

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
    padding: 6,
  },
  dateBox: {
    padding: 15,
    borderColor: "#A9A9A9",
    borderWidth: 1,
    borderRadius: 10,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "500",
  },
  datePickerContainer: {
    marginVertical: 4,
    flexDirection: "row", // Arrange in a row
    justifyContent: "space-between", // Add spacing
    alignItems: "center",
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#E9EAEC",
    borderRadius: 5,
    marginTop: 5,
    width: 150, // Adjust width to reduce size
    marginHorizontal: 10,
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
    width: Dimensions.get("window").width / 4,
  },
  availabilityItem: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 6,
  },
  tick: {
    fontSize: 16,
    color: "#000000",
  },
  available: {
    backgroundColor: "#7b68ee",
  },
  unavailable: {
    backgroundColor: "#ffffff",
  },
});

export default ApartmentList;
