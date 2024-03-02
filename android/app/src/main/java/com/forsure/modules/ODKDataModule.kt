package com.forsure.modules

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.*
import org.json.JSONObject
import android.util.Log

class ODKDataModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ODKDataModule"
    }

    @ReactMethod
    fun returnDataToODKCollect(jsonString: String) {
        val currentActivity = currentActivity

        if (currentActivity != null) {
            val returnIntent = Intent()
            try {
                val jsonObject = JSONObject(jsonString)

                jsonObject.keys().forEach { key ->
                    val value = jsonObject.getString(key)
                    returnIntent.putExtra(key, value)
                }

                currentActivity.setResult(Activity.RESULT_OK, returnIntent)
                currentActivity.finish()
            } catch (e: Exception) {
                // Handle exception
                e.printStackTrace()
            }
        }
    }

    @ReactMethod
    fun hasFullNameExtra(promise: Promise) {
        val extras = currentActivity?.intent?.extras
        val hasFullName = extras?.containsKey("full_name") ?: false
        // Log for debugging purposes
        Log.d("IntentExtras", "Has full_name: $hasFullName")
        promise.resolve(hasFullName)
    }

    @ReactMethod
    fun getIntentExtra(name: String, promise: Promise) {
        val activity = currentActivity ?: return promise.reject("ERROR", "Current activity is null")

        val intent = activity.intent
        val value = intent.getStringExtra(name)

        if (value != null) {
            promise.resolve(value)
        } else {
            promise.reject("ERROR", "No such extra: $name")
        }
    }
}
