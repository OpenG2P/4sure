package com.openg2pverifier.modules

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.*
import org.json.JSONObject

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
}
